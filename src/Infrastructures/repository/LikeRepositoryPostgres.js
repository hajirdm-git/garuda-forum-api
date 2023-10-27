const LikeRepository = require('../../Domains/likes/LikeRepository');
const LikeAdd = require('../../Domains/likes/entities/LikeAdd');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addLike(addLikepayload) {
    const { threadId, commentId, owner } = new LikeAdd(addLikepayload);
    const id = `like-${this._idGenerator()}`;
    const like = true;

    const addLikeQuery = {
      text: 'INSERT INTO comment_likes VALUES($1, $2, $3, $4, $5)',
      values: [id, threadId, commentId, owner, like],
    };

    await this._pool.query(addLikeQuery);
  }

  async removeLike(addLikepayload) {
    const { commentId, owner } = new LikeAdd(addLikepayload);
    const removeLikeQuery = {
      text: 'UPDATE comment_likes SET "like" = false WHERE ("commentId" = $1 AND owner = $2)',
      values: [commentId, owner],
    };
    await this._pool.query(removeLikeQuery);
  }

  async checkIsLike(addLikepayload) {
    const { commentId, owner } = new LikeAdd(addLikepayload);
    const checkIsLikeQuery = {
      text: 'SELECT * FROM comment_likes WHERE ("commentId" = $1 AND owner = $2)',
      values: [commentId, owner],
    };

    const result = await this._pool.query(checkIsLikeQuery);
    return (result.rowCount === 0) ? false : result.rows[0].like;
  }

  async verifyLikeOwner(addLikepayload) {
    const { commentId, owner } = new LikeAdd(addLikepayload);
    const verifyLikeQuery = {
      text: 'SELECT * FROM comment_likes WHERE "commentId" = $1 AND owner = $2',
      values: [commentId, owner],
    };
    const { rowCount } = await this._pool.query(verifyLikeQuery);

    if (!rowCount) {
      throw new AuthorizationError('Anda tidak punya akses ke like ini');
    }
  }

  async getLikeCountByCommentIds(commentIds) {
    const getLikesCuuntQuery = {
      text: `SELECT COUNT("like") AS "likeCount", "commentId"
      FROM comment_likes
      WHERE ("like" = true AND "commentId" = ANY($1::text[]))
      GROUP BY "commentId"`,
      values: [commentIds],
    };

    const { rows } = await this._pool.query(getLikesCuuntQuery);

    return rows;
  }
}

module.exports = LikeRepositoryPostgres;
