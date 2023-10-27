const pool = require('../../database/postgres/pool');
const CommentsTabelTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const LikeTableTestHelper = require('../../../../tests/LikeCommentsTableTestHelper');
const LikeRepositoryPostgres = require('../../repository/LikeRepositoryPostgres');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe(' /threads/{threadId}/comments/{commentId}/likes', () => {
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

    // addComment
    const response = await server.inject({
      method: 'POST',
      url: `/threads/${threadIdTest.id}/comments`,
      payload: {
        content: 'comment content 2222',
      },
      headers: { Authorization: `Bearer ${tokenTest}` },
    });

    const responseJson = JSON.parse(response.payload);
    commentTest = responseJson.data.addedComment;
  });

  afterEach(async () => {
    LikeTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await CommentsTabelTestHelper.cleanTable();
    await LikeTableTestHelper.cleanTable();
    await pool.end();
  });
  describe('when PUT like', () => {
    it('should response 200 and persisted data', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadIdTest.id}/comments/${commentTest.id}/likes`,
        headers: { Authorization: `Bearer ${tokenTest}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toStrictEqual('success');
    });

    it('should rempve like when isLike is true', async () => {
      // Arrange
      const server = await createServer(container);
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      await server.inject({
        method: 'PUT',
        url: `/threads/${threadIdTest.id}/comments/${commentTest.id}/likes`,
        headers: { Authorization: `Bearer ${tokenTest}` },
      });
      const addLikeFirst = await likeRepositoryPostgres.getLikeCountByCommentIds([commentTest.id]);

      await server.inject({
        method: 'PUT',
        url: `/threads/${threadIdTest.id}/comments/${commentTest.id}/likes`,
        headers: { Authorization: `Bearer ${tokenTest}` },
      });

      const addLikeSecond = await likeRepositoryPostgres.getLikeCountByCommentIds([commentTest.id]);

      expect(addLikeFirst).toHaveLength(1);
      expect(addLikeSecond).toHaveLength(0);
    });

    it('should respond with status code 404 when thread does not exist', async () => {
      // Arrange
      const server = await createServer(container);
      const fakeThread = { id: 'thread-123' };
      const fakeComment = { id: 'comment-123' };

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${fakeThread.id}/comments/${commentTest.id}/likes`,
        headers: { Authorization: `Bearer ${tokenTest}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });

    it('should respond with status code 404 when comment does not exist', async () => {
      // Arrange
      const server = await createServer(container);
      const fakeThread = { id: 'thread-123' };
      const fakeComment = { id: 'comment-123' };

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadIdTest.id}/comments/${fakeComment.id}/likes`,
        headers: { Authorization: `Bearer ${tokenTest}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });

    it('should response 401 when no auth token', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadIdTest.id}/comments/${commentTest.id}/likes`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });
  });
});
