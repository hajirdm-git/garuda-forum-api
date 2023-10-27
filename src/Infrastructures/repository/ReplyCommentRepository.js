const ReplyRepository = require('../../Domains/replies/ReplyRepository');

const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReplyComment(payload) {
    const {
      commentId, content, owner,
    } = payload;

    const date = new Date();
    const id = `reply-${this._idGenerator()}`;
    const isDelete = false;

    const addReplyQuery = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, content, commentId, date, owner, isDelete],
    };

    const result = await this._pool.query(addReplyQuery);

    return result.rows[0];
  }

  async verifyReplyExist(replyId) {
    const replyQuery = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [replyId],
    };

    const { rowCount } = await this._pool.query(replyQuery);

    if (!rowCount) {
      throw new NotFoundError('Reply tidak ditemukan');
    }
  }

  async verifyReplyOwner(replyId, owner) {
    const replyQuery = {
      text: 'SELECT * FROM replies WHERE id = $1 AND owner = $2',
      values: [replyId, owner],
    };

    const { rowCount } = await this._pool.query(replyQuery);

    if (!rowCount) {
      throw new AuthorizationError('Anda tidak punya akses ke reply ini');
    }
  }

  async deleteReplyCommentById(replyId) {
    const replyQuery = {
      text: 'UPDATE replies SET "isDelete" = true WHERE id = $1',
      values: [replyId],
    };
    await this._pool.query(replyQuery);
  }

  async getRepliesByCommentIds(commentIds) {
    const getRepliesQuery = {
      text: `SELECT replies.id, replies.content, replies.date, users.username, replies."isDelete", replies."commentId"
      FROM replies
      INNER JOIN users ON replies.owner = users.id
      WHERE replies."commentId" = ANY($1::text[])
      ORDER BY replies.date ASC`,
      values: [commentIds],
    };

    const { rows } = await this._pool.query(getRepliesQuery);

    return rows;
  }
}

module.exports = ReplyRepositoryPostgres;
