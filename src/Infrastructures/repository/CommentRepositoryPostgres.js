const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(newComment) {
    const {content, owner, threadId} = newComment;
    const id = `comment-${this._idGenerator(16)}`;
    const date = new Date().toISOString();
    const query = {
      text: 'INSERT INTO comments VALUES ($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, content, owner, threadId, date],
    };

    const result = await this._pool.query(query);

    return new AddedComment(result.rows[0]);
  }

  async isCommentExist(id, threadId) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1 AND thread_id = $2',
      values: [id, threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Komentar tidak ditemukan');
    }
  }

  async verifyCommentOwner(id, owner) {
    const query = {
      text: 'SELECT id, owner FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Komentar tidak ditemukan');
    }

    const comment = result.rows[0];

    if (comment.owner !== owner) {
      throw new AuthorizationError('Anda bukan pemilik dari komentar tersebut');
    }
  }

  async deleteCommentById(id) {
    const query = {
      text: 'UPDATE comments SET is_delete = TRUE WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError(
          'Gagal menghapus komentar, komentar tidak ditemukan',
      );
    }
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: `SELECT comments.id, comments.date, comments.content, comments.is_delete, users.username FROM comments LEFT JOIN users ON users.id = comments.owner WHERE comments.thread_id = $1 ORDER BY comments.date ASC`,
      values: [threadId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = CommentRepositoryPostgres;
