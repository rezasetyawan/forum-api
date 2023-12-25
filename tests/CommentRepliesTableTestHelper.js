/* instanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentRepliesTableTestHelper = {
  async addCommentReply({
    id = 'reply-123',
    content = 'some comment reply',
    date = new Date().toISOString(),
    owner = 'user-123',
    threadId = 'thread-123',
    commentId = 'comment-123',
  }) {
    const query = {
      text: 'INSERT INTO comment_replies VALUES ($1, $2, $3, $4, $5, $6)',
      values: [id, content, owner, commentId, threadId, date],
    };

    await pool.query(query);
  },
  async findUndeletedCommentReplyById(id) {
    const query = {
      text: 'SELECT id FROM comment_replies WHERE id = $1 AND is_delete = FALSE',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },
  async findCommentReplyById(id) {
    const query = {
      text: 'SELECT * FROM comment_replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows[0];
  },
  async cleanTable() {
    await pool.query('DELETE FROM comment_replies WHERE 1=1');
  },
};

module.exports = CommentRepliesTableTestHelper;
