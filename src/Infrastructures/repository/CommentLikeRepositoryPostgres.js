const CommentLikeRepository = require('../../Domains/comment_likes/CommentLikeRepository');

class CommentLikeRepositoryPostgres extends CommentLikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async likeComment(commentId, owner) {
    const id = `comment_like-${this._idGenerator(16)}`;
    const query = {
      text: 'INSERT INTO user_comment_likes VALUES ($1, $2, $3)',
      values: [id, owner, commentId],
    };

    await this._pool.query(query);
  }

  async unlikeComment(commentId, owner) {
    const query = {
      text: 'DELETE FROM user_comment_likes WHERE comment_id = $1 AND user_id = $2',
      values: [commentId, owner],
    };

    await this._pool.query(query);
  }

  async isCommentLiked(commentId, owner) {
    const query = {
      text: 'SELECT id FROM user_comment_likes WHERE comment_id = $1 AND user_id = $2',
      values: [commentId, owner],
    };

    const {rowCount} = await this._pool.query(query);
    // return a number
    if (rowCount) return true;
    return false;
  }

  async getCommentsLikeCountsByThreadId(threadId) {
    const query = {
      text: `
        SELECT CAST(COUNT(l.id) AS INTEGER) AS likes, c.id AS comment_id
        FROM user_comment_likes AS l
        RIGHT JOIN comments as c ON c.id = l.comment_id
        WHERE c.thread_id=$1
        GROUP BY c.id
      `,
      values: [threadId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = CommentLikeRepositoryPostgres;
