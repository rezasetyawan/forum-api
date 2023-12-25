const CommentLikeRepository = require("../CommentLikeRepository");

describe("CommentLikeRepository interface", () => {
  it("should throw error when invoke abstract behavior", async () => {
    // Arrange
    const commentLikeRepository = new CommentLikeRepository();

    // Action and Assert
    await expect(commentLikeRepository.likeComment({})).rejects.toThrowError(
      "COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );

    await expect(commentLikeRepository.unlikeComment({})).rejects.toThrowError(
      "COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );

    await expect(
      commentLikeRepository.isCommentLiked({})
    ).rejects.toThrowError("COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED");

    await expect(
      commentLikeRepository.getCommentsLikeCountsByThreadId('isnotandid')
    ).rejects.toThrowError("COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  });
});
