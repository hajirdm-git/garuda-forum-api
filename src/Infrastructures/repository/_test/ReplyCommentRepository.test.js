const ReplyCommentRepository = require('../ReplyCommentRepository');
const ThreadsTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const ReplyCommentAdd = require('../../../Domains/replies/entities/ReplyCommentAdd');
const pool = require('../../database/postgres/pool');

const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('Reply Repository Postgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({});
    await ThreadsTableTestHelper.addThread({});
    await CommentsTableTestHelper.addComment({});
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('add reply function', () => {
    it('should persist add reply', async () => {
      // Arrange
      const addCReplyCommentPayload = new ReplyCommentAdd({
        threadId: 'thread-123',
        commentId: 'comment-123',
        content: 'comment content',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123';
      const repliyId = `reply-${fakeIdGenerator()}`;

      const addedReplyPayload = {
        id: repliyId,
        content: addCReplyCommentPayload.content,
        owner: addCReplyCommentPayload.owner,
      };

      const replyCommentPostgres = new ReplyCommentRepository(pool, fakeIdGenerator);

      // Action
      const result = await replyCommentPostgres.addReplyComment(addCReplyCommentPayload);

      // Assert
      const reply = await RepliesTableTestHelper.findReplyById(repliyId);

      expect(reply).toHaveLength(1);
      expect(result.id).toEqual(addedReplyPayload.id);
      expect(result.content).toEqual(addedReplyPayload.content);
      expect(result.owner).toEqual(addedReplyPayload.owner);
    });
  });

  describe('verifyReplyExists function', () => {
    it('should throw NotFoundError when reply doesnot exist', async () => {
      // Arrange
      const replyCommentPostgres = new ReplyCommentRepository(pool, {});

      // Action
      const result = replyCommentPostgres.verifyReplyExist('reply-444444444');

      // Assert
      await expect(result).rejects.toThrowError(NotFoundError);
    });

    it('should not throw error when reply exist', async () => {
      // Arrange
      const replyCommentPostgres = new ReplyCommentRepository(pool, {});
      await RepliesTableTestHelper.addReply({});

      // Action
      const result = replyCommentPostgres.verifyReplyExist('reply-123');

      // Assert
      await expect(result).resolves.not.toThrow(NotFoundError);
    });
  });

  describe('verifyReplyOwner Function', () => {
    it('should throw AuthorizationError when reply Unauthorized', async () => {
      // Arrange
      const replyCommentPostgres = new ReplyCommentRepository(pool, {});
      await RepliesTableTestHelper.cleanTable();
      await RepliesTableTestHelper.addReply({});

      // Action
      const result = replyCommentPostgres.verifyReplyOwner('reply-123', 'user-456');

      // Action and Assert
      await expect(result).rejects.toThrowError(AuthorizationError);
    });

    it('should not throw any error when reply Authorized', async () => {
      // Arrange
      const replyCommentPostgres = new ReplyCommentRepository(pool, {});
      await RepliesTableTestHelper.cleanTable();
      await RepliesTableTestHelper.addReply({});

      // Action
      const result = replyCommentPostgres.verifyReplyOwner('reply-123', 'user-123');

      // Action and Assert
      await expect(result).resolves.not.toThrow(AuthorizationError);
    });
  });

  describe('deleteReplyCommentById Function', () => {
    it('deleteReplyCommentById Function', async () => {
      // Arrange
      const addReplyCommentPayload = new ReplyCommentAdd({
        threadId: 'thread-123',
        commentId: 'comment-123',
        content: 'comment content',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123';
      const repliyId = `reply-${fakeIdGenerator()}`;

      const replyCommentPostgres = new ReplyCommentRepository(pool, fakeIdGenerator);
      await replyCommentPostgres.addReplyComment(addReplyCommentPayload);

      // Action
      await replyCommentPostgres.deleteReplyCommentById(repliyId);

      // Assert
      const result = await RepliesTableTestHelper.findReplyById(repliyId);

      expect(result).toHaveLength(1);
      expect(result[0].isDelete).toEqual(true);
      expect(result[0].id).toEqual('reply-123');
      expect(result[0].content).toEqual('comment content');
      expect(result[0].date).toBeDefined();
      expect(result[0].owner).toEqual('user-123');
      expect(result[0].commentId).toEqual('comment-123');
    });
  });

  describe('getRepliesByCommentIds Function', () => {
    it('get replies fungtion', async () => {
      // Arrange
      const fakeIdGenerator1 = () => 'a-123';
      const addCReplyComment1 = new ReplyCommentAdd({
        threadId: 'thread-123',
        commentId: 'comment-123',
        content: 'comment content 1',
        owner: 'user-123',
      });
      const repliy1Id = `reply-${fakeIdGenerator1()}`;
      const replyCommentPostgres1 = new ReplyCommentRepository(pool, fakeIdGenerator1);
      await replyCommentPostgres1.addReplyComment(addCReplyComment1);

      const fakeIdGenerator2 = () => 'b-123';
      const addCReplyComment2 = new ReplyCommentAdd({
        threadId: 'thread-123',
        commentId: 'comment-123',
        content: 'comment content 2',
        owner: 'user-123',
      });

      const repliy2Id = `reply-${fakeIdGenerator2()}`;
      const replyCommentPostgres2 = new ReplyCommentRepository(pool, fakeIdGenerator2);
      await replyCommentPostgres2.addReplyComment(addCReplyComment2);
      await replyCommentPostgres2.deleteReplyCommentById(repliy2Id);

      // Action
      const result = await replyCommentPostgres1.getRepliesByCommentIds(['comment-123']);

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0].id).toEqual(repliy1Id);
      expect(result[0].content).toEqual('comment content 1');
      expect(result[0].date).toBeDefined();
      expect(result[0].username).toEqual('dicoding');
      expect(result[0].isDelete).toEqual(false);
      expect(result[0].commentId).toEqual('comment-123');

      expect(result[1].id).toEqual(repliy2Id);
      expect(result[1].content).toEqual('comment content 2');
      expect(result[1].date).toBeDefined();
      expect(result[1].username).toEqual('dicoding');
      expect(result[1].isDelete).toEqual(true);
      expect(result[1].commentId).toEqual('comment-123');
    });
  });
});
