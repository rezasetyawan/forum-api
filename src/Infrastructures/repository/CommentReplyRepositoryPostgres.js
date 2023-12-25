const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CommentReplyRepository = require('../../Domains/comment_replies/CommentReplyRepository');
const AddedCommentReply = require('../../Domains/comment_replies/entities/AddedCommentReply');

class CommentReplyRepositoryPostgres extends CommentReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addCommentReply(newComment) {
    const {content, owner, threadId, commentId} = newComment;
    const id = `reply-${this._idGenerator(16)}`;
    const date = new Date().toISOString();
    const query = {
      text: 'INSERT INTO comment_replies VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, content, owner, commentId, threadId, date],
    };

    const result = await this._pool.query(query);
    return new AddedCommentReply(result.rows[0]);
  }

  async isCommentReplyExist(id, threadId) {
    const query = {
      text: 'SELECT id FROM comment_replies WHERE id = $1 AND thread_id = $2',
      values: [id, threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Komentar balasan tidak ditemukan');
    }
  }

  async verifyCommentReplyOwner(id, owner) {
    const query = {
      text: 'SELECT id, owner FROM comment_replies WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Komentar balasan tidak ditemukan');
    }

    const commentReply = result.rows[0];

    if (commentReply.owner !== owner) {
      throw new AuthorizationError(
          'Anda bukan pemilik dari komentar balasan tersebut',
      );
    }
  }

  async deleteCommentReplyById(id) {
    const query = {
      text: 'UPDATE comment_replies SET is_delete = TRUE WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError(
          'Gagal menghapus komentar balasan, komentar balasan tidak ditemukan',
      );
    }
  }

  async getCommentRepliesByThreadId(threadId) {
    const query = {
      text: `SELECT comment_replies.id, comment_replies.date, comment_replies.content, comment_replies.is_delete, comment_replies.comment_id, users.username FROM comment_replies LEFT JOIN users ON users.id = comment_replies.owner WHERE comment_replies.thread_id = $1 ORDER BY comment_replies.date ASC`,
      values: [threadId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = CommentReplyRepositoryPostgres;
