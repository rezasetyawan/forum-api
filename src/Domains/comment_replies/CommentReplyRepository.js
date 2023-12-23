class CommentReplyRepository {
  async addCommentReply(newComment) {
    throw new Error("COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async isCommentReplyExist(id, threadId) {
    throw new Error("COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async verifyCommentReplyOwner(id, owner) {
    throw new Error("COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async deleteCommentReplyById(id) {
    throw new Error("COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async getCommentRepliesByThreadId(threadId) {
    throw new Error("COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }
}

module.exports = CommentReplyRepository;
