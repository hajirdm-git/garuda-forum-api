const ThreadsTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadAdd = require('../../../Domains/threads/entities/ThreadAdd');
const ThreadAdded = require('../../../Domains/threads/entities/ThreadAdded');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('ThreadRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({});
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('add thread function', () => {
    it('should persist add thread', async () => {
      // Arrange
      const addThreadPayload = new ThreadAdd({
        title: 'thread title',
        body: 'thread body',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123';
      const threadId = `thread-${fakeIdGenerator()}`;

      const addedThreadPayload = new ThreadAdded({
        id: threadId,
        title: addThreadPayload.title,
        owner: addThreadPayload.owner,
      });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const result = await threadRepositoryPostgres.addThread(addThreadPayload);

      // Assert
      const thread = await ThreadsTableTestHelper.findThreadsById(threadId);
      expect(thread).toHaveLength(1);
      expect(result.id).toEqual(addedThreadPayload.id);
      expect(result.title).toEqual(addedThreadPayload.title);
      expect(result.owner).toEqual(addedThreadPayload.owner);
    });
  });

  describe('verifyThreadExists function', () => {
    it('should throw NotFoundError when thread doesn\'t exist with the given thread id', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await ThreadsTableTestHelper.cleanTable();
      await ThreadsTableTestHelper.addThread({});

      // Action and Assert
      await expect(threadRepositoryPostgres.verifyThreadExist('thread-456'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should not throw any error when thread exists', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await ThreadsTableTestHelper.addThread({});

      // Action and Assert
      await expect(threadRepositoryPostgres.verifyThreadExist('thread-123'))
        .resolves
        .not
        .toThrow(NotFoundError);
    });
  });

  describe('Verify Thread Owner function', () => {
    it('should throw AuthorizationError when thread Unauthorized', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await ThreadsTableTestHelper.cleanTable();
      await ThreadsTableTestHelper.addThread({});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThreadOwner('thread-123', 'user-456'))
        .rejects
        .toThrowError(AuthorizationError);
    });

    it('should not throw any error when thread Authorized', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await ThreadsTableTestHelper.cleanTable();
      await ThreadsTableTestHelper.addThread({});

      // Action  & Assert
      await expect(threadRepositoryPostgres.verifyThreadOwner('thread-123', 'user-123'))
        .resolves
        .not
        .toThrowError(AuthorizationError);
    });
  });

  describe('get detail thread function', () => {
    it('sholud get thread detail by id', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await ThreadsTableTestHelper.cleanTable();
      await ThreadsTableTestHelper.addThread({});

      // Action
      const result = await threadRepositoryPostgres.getDetailThreadById('thread-123');

      // Assert
      expect(result.id).toEqual('thread-123');
      expect(result.title).toEqual('thread title');
      expect(result.body).toEqual('thread body');
      expect(result.date).toBeDefined();
      expect(result.username).toEqual('dicoding');
    });
  });
});
