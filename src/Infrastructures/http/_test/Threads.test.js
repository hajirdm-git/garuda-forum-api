/* istanbul ignore file */

const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/thread endpoint', () => {
  let tokenTest = '';

  beforeAll(async () => {
    const requestPayload = {
      username: 'dicoding',
      password: 'secret',
    };
    const server = await createServer(container);

    // addUser
    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      },
    });

    // Action
    const response = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: requestPayload,
    });

    // Get Token
    const responseJson = JSON.parse(response.payload);
    tokenTest = responseJson.data.accessToken;
  });

  afterAll(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('when \thread POST', () => {
    it('should response 201 and persisted thread', async () => {
      // Arrange
      const requestPayload = {
        title: 'thread title',
        body: 'thread body',
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: { Authorization: `Bearer ${tokenTest}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread.id).toBeDefined();
      expect(responseJson.data.addedThread.title).toEqual(requestPayload.title);
      expect(responseJson.data.addedThread.owner).toBeDefined();
    });

    it('should response 400 when body request not contain need property', async () => {
      // Arrange
      const requestPayload = {
        title: 'thread title',
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: { Authorization: `Bearer ${tokenTest}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).not.toBeNull();
    });

    it('should response 400 when body request not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        title: 1234,
        body: 'thread body',
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: { Authorization: `Bearer ${tokenTest}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).not.toBeNull();
    });

    it('should response 401 when no auth token', async () => {
      // Arrange
      const requestPayload = {
        title: 'thread title',
        body: 'thread body',
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });
  });

  describe('get thread detail', () => {
    it('should response 404 when thread doesnt exist', async () => {
      // arrange
      const server = await createServer(container);
      const threadId = 'thread-123dddddddd';

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).not.toBeNull();
    });
    it('should response 200 when thread exist', async () => {
      // Arrange
      const server = await createServer(container);

      const addThreadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'thread title',
          body: 'thread body',
        },
        headers: { Authorization: `Bearer ${tokenTest}` },
      });

      const addThreadResponseJson = JSON.parse(addThreadResponse.payload);
      const threadTest = addThreadResponseJson.data.addedThread;

      const responseAddComment1 = await server.inject({
        method: 'POST',
        url: `/threads/${threadTest.id}/comments`,
        payload: {
          content: 'comment content pertama',
        },
        headers: { Authorization: `Bearer ${tokenTest}` },
      });
      const addCommentResponseJson1 = JSON.parse(responseAddComment1.payload);
      const commentTest1 = addCommentResponseJson1.data.addedComment;

      const responseAddComment = await server.inject({
        method: 'POST',
        url: `/threads/${threadTest.id}/comments`,
        payload: {
          content: 'comment content kedua',
        },
        headers: { Authorization: `Bearer ${tokenTest}` },
      });
      const addCommentResponseJson = JSON.parse(responseAddComment.payload);
      const commentTest = addCommentResponseJson.data.addedComment;

      await server.inject({
        method: 'DELETE',
        url: `/threads/${threadTest.id}/comments/${commentTest.id}`,
        headers: { Authorization: `Bearer ${tokenTest}` },
      });

      // Add Reply to comment1
      const addreplyCommentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadTest.id}/comments/${commentTest.id}/replies`,
        payload: {
          content: 'content reply commet',
        },
        headers: { Authorization: `Bearer ${tokenTest}` },
      });

      // Add like Comment1
      await server.inject({
        method: 'PUT',
        url: `/threads/${threadTest.id}/comments/${commentTest.id}/likes`,
        headers: { Authorization: `Bearer ${tokenTest}` },
      });

      await server.inject({
        method: 'PUT',
        url: `/threads/${threadTest.id}/comments/${commentTest.id}/likes`,
        headers: { Authorization: `Bearer ${tokenTest}` },
      });

      // Action
      const getThreadDetailResponse = await server.inject({
        method: 'GET',
        url: `/threads/${threadTest.id}`,
      });

      const getThreadDetailResponseJson = JSON.parse(getThreadDetailResponse.payload);
      expect(getThreadDetailResponse.statusCode).toEqual(200);
      expect(getThreadDetailResponseJson.data.thread).not.toBeNull();
      expect(getThreadDetailResponseJson.data.thread.comments).not.toBeNull();
      expect(getThreadDetailResponseJson.data.thread.comments).toHaveLength(2);
      expect(getThreadDetailResponseJson.data.thread.comments[1].replies).not.toBeNull();
      expect(getThreadDetailResponseJson.data.thread.comments[1].likeCount).not.toBeNull();
      expect(getThreadDetailResponseJson.data.thread.comments[1].likeCount).toEqual(0);
    });
  });
});
