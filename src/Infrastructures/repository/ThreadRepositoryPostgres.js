const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const ThreadAdded = require('../../Domains/threads/entities/ThreadAdded');

const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(addThreadPayload) {
    const { title, body, owner } = addThreadPayload;
    const date = new Date();
    const id = `thread-${this._idGenerator()}`;

    const addThreadQuery = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [id, title, body, date, owner],
    };

    const result = await this._pool.query(addThreadQuery);
    return new ThreadAdded(result.rows[0]);
  }

  async verifyThreadExist(threadId) {
    const threadQuery = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [threadId],
    };

    const { rowCount } = await this._pool.query(threadQuery);

    if (!rowCount) {
      throw new NotFoundError('Thread tidak ditemukan');
    }
  }

  async getDetailThreadById(threadId) {
    const threadQuery = {
      text: `SELECT threads.id, threads.title, threads.body, threads.date, users.username
        FROM threads
        INNER JOIN users ON threads.owner = users.id
        WHERE threads.id = $1`,
      values: [threadId],
    };
    const threadResult = await this._pool.query(threadQuery);

    return threadResult.rows[0];
  }

  async verifyThreadOwner(threadId, owner) {
    const threadQuery = {
      text: 'SELECT * FROM threads WHERE id = $1 AND owner = $2',
      values: [threadId, owner],
    };

    const { rowCount } = await this._pool.query(threadQuery);

    if (!rowCount) {
      throw new AuthorizationError('Anda tidak punya akses ke thread ini');
    }
  }
}

module.exports = ThreadRepositoryPostgres;
