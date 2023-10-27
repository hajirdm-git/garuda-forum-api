const CommentRepository = require('../../Domains/comments/CommentRepository');
const CommentAdded = require('../../Domains/comments/entities/CommentAdded');

const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(addCommentPayload) {
    const { threadId, content, owner } = addCommentPayload;
    const date = new Date();
    const id = `comment-${this._idGenerator()}`;
    const isDelete = false;

    const addCommentQuery = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, content, threadId, date, owner, isDelete],
    };

    const result = await this._pool.query(addCommentQuery);

    return new CommentAdded(result.rows[0]);
  }

  async getCommentsByThreadId(threadId) {
    const commentQuery = {
      text: `SELECT comments.id, comments.date, comments.content, comments."isDelete", users.username
        FROM comments
        INNER JOIN users ON comments.owner = users.id
        WHERE comments."threadId" = $1
        ORDER BY comments.date ASC`,
      values: [threadId],
    };

    const result = await this._pool.query(commentQuery);

    return result.rows;
  }

  async verifyCommentExist(commentId) {
    const commentQuery = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [commentId],
    };

    const { rowCount } = await this._pool.query(commentQuery);

    if (!rowCount) {
      throw new NotFoundError('Comment tidak ditemukan');
    }
  }

  async verifyCommentOwner(commentId, owner) {
    const commentQuery = {
      text: 'SELECT * FROM comments WHERE id = $1 AND owner = $2',
      values: [commentId, owner],
    };

    const { rowCount } = await this._pool.query(commentQuery);

    if (!rowCount) {
      throw new AuthorizationError('Anda tidak punya akses ke comment ini');
    }
  }

  async deleteCommentById(commentId) {
    const deleteQuery = {
      text: 'UPDATE comments SET "isDelete" = true WHERE id = $1',
      values: [commentId],
    };
    await this._pool.query(deleteQuery);
  }
}

module.exports = CommentRepositoryPostgres;
