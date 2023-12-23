/* instanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");

const CommentsTableTestHelper = {
  async addComment({
    id = "comment-123",
    content = "some comment",
    date = new Date().toISOString(),
    owner = "user-123",
    threadId = "thread-123",
  }) {
    const query = {
      text: "INSERT INTO comments VALUES ($1, $2, $3, $4, $5)",
      values: [id, content, owner, threadId, date],
    };

    await pool.query(query);
  },
  async findUndeletedCommentById(id) {
    const query = {
      text: "SELECT id FROM comments WHERE id = $1 AND is_delete = FALSE",
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },
  async findCommentById(id) {
    const query = {
      text: "SELECT * FROM comments WHERE id = $1",
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows[0];
  },
  async cleanTable() {
    await pool.query("DELETE FROM comments WHERE 1=1");
  },
};

module.exports = CommentsTableTestHelper;
