const pool = require('../../database/postgres/pool');
const CommentsTabelTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe(' /threads/{threadId}/comments/{commentId}/replies', () => {
  let tokenTest = '';
  let threadIdTest = '';
  let commentTest = '';

  beforeAll(async () => {
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
      payload: {
        username: 'dicoding',
        password: 'secret',
      },
    });

    // Get Token
    const loginResponseJson = JSON.parse(loginResponse.payload);
    tokenTest = loginResponseJson.data.accessToken;

    // addThread
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
    threadIdTest = addThreadResponseJson.data.addedThread;

    // Add comment
    const addCommentresponse = await server.inject({
      method: 'POST',
      url: `/threads/${threadIdTest.id}/comments`,
      payload: { content: 'comment content' },
      headers: { Authorization: `Bearer ${tokenTest}` },
    });

    const addReplyResponseJson = JSON.parse(addCommentresponse.payload);
    commentTest = addReplyResponseJson.data.addedComment;
  });

  afterEach(async () => {
    RepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await CommentsTabelTestHelper.cleanTable();
    await pool.end();
  });

  describe('When POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 201 and persisted reply comment', async () => {
      // Arrange
      const requestPayload = {
        content: 'Reply comment content 2222',
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadIdTest.id}/comments/${commentTest.id}/replies`,
        payload: requestPayload,
        headers: { Authorization: `Bearer ${tokenTest}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      const result = responseJson.data.addedReply;

      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedReply.id).toBeDefined();
      expect(responseJson.data.addedReply.content).toBeDefined();
      expect(responseJson.data.addedReply.owner).toBeDefined();
    });

    it('should response 400 when body request not contain need property', async () => {
      // Arrange
      const requestPayload = {};

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadIdTest.id}/comments/${commentTest.id}/replies`,
        payload: requestPayload,
        headers: { Authorization: `Bearer ${tokenTest}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
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
        url: `/threads/${threadIdTest.id}/comments/${commentTest.id}/replies`,
        payload: requestPayload,
        headers: { Authorization: `Bearer ${tokenTest}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
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
        url: `/threads/${threadIdTest.id}/comments/${commentTest.id}/replies`,
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 404 when invalid thread', async () => {
    // Arrange
      const requestPayload = {
        content: 'Reply comment content 2222',
      };
      const fakeThreadId = 'thread-fakefakefake';

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${fakeThreadId}/comments/${commentTest.id}/replies`,
        payload: requestPayload,
        headers: { Authorization: `Bearer ${tokenTest}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });
    it('should response 404 when invalid comment', async () => {
    // Arrange
      const requestPayload = {
        content: 'Reply comment content 2222',
      };
      const fakeCommentId = 'comment-fakefakefake';

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadIdTest.id}/comments/${fakeCommentId}/replies`,
        payload: requestPayload,
        headers: { Authorization: `Bearer ${tokenTest}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });
  });

  describe('When Delete /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    it('should response 200 and persisted delete reply comment', async () => {
      // Arrange
      const requestPayload = {
        content: 'Reply comment content 2222',
      };

      const server = await createServer(container);

      const AddReplyResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadIdTest.id}/comments/${commentTest.id}/replies`,
        payload: requestPayload,
        headers: { Authorization: `Bearer ${tokenTest}` },
      });

      const AddReplyResponseJson = JSON.parse(AddReplyResponse.payload);
      const replyTest = AddReplyResponseJson.data.addedReply;

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadIdTest.id}/comments/${commentTest.id}/replies/${replyTest.id}`,
        headers: { Authorization: `Bearer ${tokenTest}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      const deletedReply = await RepliesTableTestHelper.findReplyById(replyTest.id);

      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(deletedReply[0].isDelete).toEqual(true);
    });

    it('should response 401 when no auth token', async () => {
      // Arrange
      const server = await createServer(container);
      const addreplyCommentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadIdTest.id}/comments/${commentTest.id}/replies`,
        payload: {
          content: 'content reply commet',
        },
        headers: { Authorization: `Bearer ${tokenTest}` },
      });

      const addreplyCommentResponseJson = JSON.parse(addreplyCommentResponse.payload);
      const replyTest = addreplyCommentResponseJson.data.addedReply;

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadIdTest.id}/comments/${commentTest.id}/replies/${replyTest.id}`,
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
          username: 'dicodingNew',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicodingNew',
          password: 'secret',
        },
      });

      // Get Token
      const loginResponseJson = JSON.parse(loginResponse.payload);
      const tokenTestNew = loginResponseJson.data.accessToken;

      const addreplyCommentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadIdTest.id}/comments/${commentTest.id}/replies`,
        payload: {
          content: 'content reply commet',
        },
        headers: { Authorization: `Bearer ${tokenTest}` },
      });

      const addreplyCommentResponseJson = JSON.parse(addreplyCommentResponse.payload);
      const replyTest = addreplyCommentResponseJson.data.addedReply;

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadIdTest.id}/comments/${commentTest.id}/replies/${replyTest.id}`,
        headers: { Authorization: `Bearer ${tokenTestNew}` },
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

      const addreplyCommentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadIdTest.id}/comments/${commentTest.id}/replies`,
        payload: {
          content: 'content reply commet',
        },
        headers: { Authorization: `Bearer ${tokenTest}` },
      });

      const addreplyCommentResponseJson = JSON.parse(addreplyCommentResponse.payload);
      const replyTest = addreplyCommentResponseJson.data.addedReply;

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${fakeThreadId}/comments/${commentTest.id}/replies/${replyTest.id}`,
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

      const addreplyCommentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadIdTest.id}/comments/${commentTest.id}/replies`,
        payload: {
          content: 'content reply commet',
        },
        headers: { Authorization: `Bearer ${tokenTest}` },
      });

      const addreplyCommentResponseJson = JSON.parse(addreplyCommentResponse.payload);
      const replyTest = addreplyCommentResponseJson.data.addedReply;

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadIdTest.id}/comments/${fakeCommentId}/replies/${replyTest.id}`,
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
