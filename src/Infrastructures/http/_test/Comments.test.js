const pool = require('../../database/postgres/pool');
const CommentsTabelTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads/{threadId}/comments', () => {
  let tokenTest = '';
  let threadIdTest = '';
  let commentTest = '';

  beforeAll(async () => {
    const requestPayload = {
      username: 'dicoding',
      password: 'secret',
    };

    const requestAddThreadPayload = {
      title: 'thread title',
      body: 'thread body',
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

    // User Login
    const loginResponse = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: requestPayload,
    });

    // Get Token
    const loginResponseJson = JSON.parse(loginResponse.payload);
    tokenTest = loginResponseJson.data.accessToken;

    // addThread
    const addThreadResponse = await server.inject({
      method: 'POST',
      url: '/threads',
      payload: requestAddThreadPayload,
      headers: { Authorization: `Bearer ${tokenTest}` },
    });

    const addThreadResponseJson = JSON.parse(addThreadResponse.payload);
    threadIdTest = addThreadResponseJson.data.addedThread;
  });

  afterAll(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await CommentsTabelTestHelper.cleanTable();
    await pool.end();
  });

  describe('when post /threads/{threadId}/comments', () => {
    it('should response 201 and persisted comment', async () => {
      // Arrange
      const requestPayload = {
        content: 'comment content 2222',
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadIdTest.id}/comments`,
        payload: requestPayload,
        headers: { Authorization: `Bearer ${tokenTest}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      commentTest = responseJson.data.addedComment;

      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment.id).toBeDefined();
      expect(responseJson.data.addedComment.content).toBeDefined();
      expect(responseJson.data.addedComment.owner).toBeDefined();
    });
    it('should response 400 when body request not contain need property', async () => {
      // Arrange
      const requestPayload = {
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadIdTest.id}/comments`,
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
        content: 123,
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadIdTest.id}/comments`,
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
        content: 'comment content',
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadIdTest.id}/comments`,
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 200 and deleted comment', async () => {
      // Arrange
      const server = await createServer(container);

      const addCommentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadIdTest.id}/comments`,
        payload: { content: 'comment content' },
        headers: { Authorization: `Bearer ${tokenTest}` },
      });

      const addCommentResponseJson = JSON.parse(addCommentResponse.payload);
      const commentId = addCommentResponseJson.data.addedComment.id;

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadIdTest.id}/comments/${commentId}`,
        headers: { Authorization: `Bearer ${tokenTest}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      const commentDeleted = await CommentsTabelTestHelper.findCommentsById(commentId);
      expect(commentDeleted[0].isDelete).toEqual(true);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 401 when no auth token', async () => {
      // Arrange
      const server = await createServer(container);

      const addCommentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadIdTest.id}/comments`,
        payload: { content: 'comment content' },
        headers: { Authorization: `Bearer ${tokenTest}` },
      });

      const addCommentResponseJson = JSON.parse(addCommentResponse.payload);
      const commentId = addCommentResponseJson.data.addedComment.id;

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadIdTest.id}/comments/${commentId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).not.toBeNull();
    });

    it('should response 403 when invalid auth token', async () => {
      // Arrange
      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'newDicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // User Login
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'newDicoding',
          password: 'secret',
        },
      });

      // Get Token
      const loginResponseJson = JSON.parse(loginResponse.payload);
      const newToken = loginResponseJson.data.accessToken;

      const addCommentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadIdTest.id}/comments`,
        payload: { content: 'comment content' },
        headers: { Authorization: `Bearer ${tokenTest}` },
      });

      const addCommentResponseJson = JSON.parse(addCommentResponse.payload);
      const commentId = addCommentResponseJson.data.addedComment.id;

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadIdTest.id}/comments/${commentId}`,
        headers: { Authorization: `Bearer ${newToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).not.toBeNull();
    });

    it('should response 404 when invalid threadId ', async () => {
      // Arrange
      const server = await createServer(container);
      const fakeThreadId = 'thread-fakefakefake';

      const addCommentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadIdTest.id}/comments`,
        payload: { content: 'comment content' },
        headers: { Authorization: `Bearer ${tokenTest}` },
      });

      const addCommentResponseJson = JSON.parse(addCommentResponse.payload);
      const commentId = addCommentResponseJson.data.addedComment.id;

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${fakeThreadId}/comments/${commentId}`,
        headers: { Authorization: `Bearer ${tokenTest}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).not.toBeNull();
    });

    it('should response 404 when invalid commentId ', async () => {
      // Arrange
      const server = await createServer(container);
      const fakeCommentId = 'comment-fakefakefake';

      const addCommentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadIdTest.id}/comments`,
        payload: { content: 'comment content' },
        headers: { Authorization: `Bearer ${tokenTest}` },
      });

      const addCommentResponseJson = JSON.parse(addCommentResponse.payload);
      const commentId = addCommentResponseJson.data.addedComment.id;

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadIdTest.id}/comments/${fakeCommentId}`,
        headers: { Authorization: `Bearer ${tokenTest}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).not.toBeNull();
    });
  });
});
