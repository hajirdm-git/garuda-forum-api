const pool = require('../../database/postgres/pool');

const ThreadsTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const LikeCommentTableTestHelper = require('../../../../tests/LikeCommentsTableTestHelper');

const LikeAdd = require('../../../Domains/likes/entities/LikeAdd');
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');

const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('Like Repository Postgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({});
    await ThreadsTableTestHelper.addThread({});
    await CommentsTableTestHelper.addComment({});
  });

  afterEach(async () => {
    await LikeCommentTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('Like Function', () => {
    it('should persist add like', async () => {
      // Arrange
      const payload = new LikeAdd({
        threadId: 'thread-123',
        commentId: 'comment-123',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await likeRepositoryPostgres.addLike(payload);

      // Assert
      const like = await LikeCommentTableTestHelper.findLike(payload.commentId, payload.owner);

      expect(like).toHaveLength(1);
      expect(like[0].id).toBeDefined();
      expect(like[0].threadId).toEqual(payload.threadId);
      expect(like[0].commentId).toEqual(payload.commentId);
      expect(like[0].like).toEqual(true);
      expect(like[0].owner).toEqual(payload.owner);
    });

    it('should remove like', async () => {
      // Arrange
      const payload = new LikeAdd({
        threadId: 'thread-123',
        commentId: 'comment-123',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);
      await likeRepositoryPostgres.addLike(payload);

      // Action
      await likeRepositoryPostgres.removeLike(payload);

      // Assert
      const result = await LikeCommentTableTestHelper.findLike(payload.commentId, payload.owner);

      expect(result[0].like).toEqual(false);
    });

    it('should check isLike', async () => {
      // Arrange
      const payload = new LikeAdd({
        threadId: 'thread-123',
        commentId: 'comment-123',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);
      await likeRepositoryPostgres.addLike(payload);

      // Action
      const result = await likeRepositoryPostgres.checkIsLike(payload);

      // Assert
      expect(result).toEqual(true);
    });

    it('should verify like owner', async () => {
      // Arrange
      const payload = new LikeAdd({
        threadId: 'thread-123',
        commentId: 'comment-123',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);
      await likeRepositoryPostgres.addLike(payload);

      // Action
      await likeRepositoryPostgres.verifyLikeOwner(payload);

      // Assert
      const like = await LikeCommentTableTestHelper.findLike(payload.commentId, payload.owner);
      expect(like[0].owner).toEqual(payload.owner);
    });

    it('should get like count by comment id', async () => {
      // Arrange
      const payload = new LikeAdd({
        threadId: 'thread-123',
        commentId: 'comment-123',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);
      await likeRepositoryPostgres.addLike(payload);

      await CommentsTableTestHelper.addComment({ id: 'comment-456' });

      const payload2 = new LikeAdd({
        threadId: 'thread-123',
        commentId: 'comment-456',
        owner: 'user-123',
      });

      const fakeIdGenerator2 = () => '456';
      const likeRepositoryPostgres2 = new LikeRepositoryPostgres(pool, fakeIdGenerator2);
      await likeRepositoryPostgres2.addLike(payload2);

      const payload3 = new LikeAdd({
        threadId: 'thread-123',
        commentId: 'comment-456',
        owner: 'user-456',
      });
      await UsersTableTestHelper.addUser({
        id: 'user-456', username: 'newdicoding', password: 'secret', fullname: 'Dicoding Indonesia',
      });

      const fakeIdGenerator3 = () => '234';
      const likeRepositoryPostgres3 = new LikeRepositoryPostgres(pool, fakeIdGenerator3);
      await likeRepositoryPostgres3.addLike(payload3);
      await likeRepositoryPostgres3.removeLike(payload3);

      // Action
      const result = await likeRepositoryPostgres.getLikeCountByCommentIds(['comment-123', 'comment-456']);

      // Assert
      expect(result).toHaveLength(2);
      result.forEach((element) => {
        if (element.commentId === 'comment-123') {
          expect(element.likeCount).toEqual('1');
        } else {
          expect(element.likeCount).toEqual('1');
        }
      });
    });
  });
});
