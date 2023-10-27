const ThreadsTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const CommentAdd = require('../../../Domains/comments/entities/CommentAdd');
const CommentAdded = require('../../../Domains/comments/entities/CommentAdded');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('CommentRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({});
    await ThreadsTableTestHelper.addThread({});
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('add comment function', () => {
    it('should persist add comment', async () => {
      // Arrange
      const addCommentPayload = new CommentAdd({
        threadId: 'thread-123',
        content: 'comment content',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123';
      const commentId = `comment-${fakeIdGenerator()}`;

      const addedCommentPayload = new CommentAdded({
        id: commentId,
        content: addCommentPayload.content,
        owner: addCommentPayload.owner,
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const result = await commentRepositoryPostgres.addComment(addCommentPayload);

      // Assert
      const comment = await CommentsTableTestHelper.findCommentsById(commentId);
      expect(comment).toHaveLength(1);
      expect(result.id).toEqual(addedCommentPayload.id);
      expect(result.content).toEqual(addedCommentPayload.content);
      expect(result.owner).toEqual(addedCommentPayload.owner);
    });
  });

  describe('verifyCommentExists function', () => {
    it('should throw NotFoundError when thread doesnot exist with the given thread id', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await CommentsTableTestHelper.cleanTable();
      await CommentsTableTestHelper.addComment({});

      // Action and Assert
      await expect(commentRepositoryPostgres.verifyCommentExist('comment-456'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should not throw any error when thread exists', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await CommentsTableTestHelper.addComment({});

      // Action and Assert
      await expect(commentRepositoryPostgres.verifyCommentExist('comment-123'))
        .resolves
        .not
        .toThrow(NotFoundError);
    });
  });

  describe('verifyCommentOwner Function', () => {
    it('should throw AuthorizationError when comment Unauthorized', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await CommentsTableTestHelper.cleanTable();
      await CommentsTableTestHelper.addComment({});

      // Action and Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-456'))
        .rejects
        .toThrowError(AuthorizationError);
    });

    it('should not throw any error when comment Authorized', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await CommentsTableTestHelper.cleanTable();
      await CommentsTableTestHelper.addComment({});

      // Action and Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123'))
        .resolves
        .not
        .toThrowError(AuthorizationError);
    });
  });

  describe('delete comment function', () => {
    it('should isDelete value is true', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await CommentsTableTestHelper.cleanTable();
      await CommentsTableTestHelper.addComment({});

      // Action
      await commentRepositoryPostgres.deleteCommentById('comment-123');

      // Assert
      const commentDeleted = await CommentsTableTestHelper.findCommentsById('comment-123');
      expect(commentDeleted[0].isDelete).toEqual(true);

      expect(commentDeleted[0].id).toEqual('comment-123');
      expect(commentDeleted[0].content).toEqual('comment content');
      expect(commentDeleted[0].date).toBeDefined();
      expect(commentDeleted[0].threadId).toEqual('thread-123');
      expect(commentDeleted[0].owner).toEqual('user-123');
    });
  });

  describe('get comments by thread id function', () => {
    it('should get comment with given threadId', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const threadId = 'thread-123';

      await CommentsTableTestHelper.cleanTable();
      await CommentsTableTestHelper.addComment({});
      await CommentsTableTestHelper.addComment({ id: 'comment-456' });

      // Action
      const result = await commentRepositoryPostgres.getCommentsByThreadId(threadId);

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0].id).toBeDefined();
      expect(result[0].content).toBeDefined();
      expect(result[0].date).toBeDefined();
      expect(result[0].username).toBeDefined();
      expect(result[0].isDelete).toBeDefined();

      expect(result[1].id).toBeDefined();
      expect(result[1].content).toBeDefined();
      expect(result[1].date).toBeDefined();
      expect(result[1].username).toBeDefined();
      expect(result[1].isDelete).toBeDefined();
    });
  });
});
