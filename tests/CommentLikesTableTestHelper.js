/* instanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentLikesTableTestHelper = {
  async addCommentLike({
    id = 'comment_like-123',
    owner = 'user-123',
    commentId = 'comment-123',
  }) {
    const query = {
      text: 'INSERT INTO user_comment_likes VALUES ($1, $2, $3)',
      values: [id, owner, commentId],
    };

    await pool.query(query);
  },
  async getCommentLike(commentId, owner) {
    const query = {
      text: 'SELECT * FROM user_comment_likes WHERE comment_id = $1 AND user_id = $2',
      values: [commentId, owner],
    };

    const result = await pool.query(query);
    // return a number
    return result.rows;
  },
  async cleanTable() {
    await pool.query('DELETE FROM user_comment_likes WHERE 1=1');
  },
};

module.exports = CommentLikesTableTestHelper;
