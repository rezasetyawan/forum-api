/* eslint-disable require-jsdoc */
class LikeAndUnlikeUseCommentCase {
  constructor({commentRepository, commentLikeRepository}) {
    this._commentRepository = commentRepository;
    this._commentLikeRepository = commentLikeRepository;
  }

  async execute(useCasePayload) {
    const {threadId, commentId, owner} = useCasePayload;
    await this._commentRepository.isCommentExist(commentId, threadId);
    const isCommentLiked = await this._commentLikeRepository.isCommentLiked(
        commentId,
        owner,
    );

    if (isCommentLiked) {
      await this._commentLikeRepository.unlikeComment(commentId, owner);
    } else {
      await this._commentLikeRepository.likeComment(commentId, owner);
    }
  }
}

module.exports = LikeAndUnlikeUseCommentCase;
