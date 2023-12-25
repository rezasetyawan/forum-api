class CommentLikeRepository {
  async likeComment(commentId, owner) {
    throw new Error("COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async unlikeComment(commentId, owner) {
    throw new Error("COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async isCommentLiked(commentId, owner) {
    throw new Error("COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async getCommentsLikeCountsByThreadId(threadId) {
    throw new Error("COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }
}

module.exports = CommentLikeRepository;
