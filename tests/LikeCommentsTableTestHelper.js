/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addLike({
    id = 'like-123',
    threadId = 'thread-123',
    commentId = 'comment-123',
    owner = 'user-123',
    like = false,
  }) {
    const query = {
      text: 'INSERT INTO comment_likes VALUES($1, $2, $3, $4, $5)',
      values: [id, threadId, commentId, owner, like],
    };

    await pool.query(query);
  },

  async findLike(commentId, owner) {
    const query = {
      text: 'SELECT * FROM  comment_likes WHERE "commentId" = $1 AND owner = $2',
      values: [commentId, owner],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM  comment_likes WHERE 1=1');
  },
};

module.exports = CommentsTableTestHelper;
