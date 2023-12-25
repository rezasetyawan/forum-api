const LikeAndUnlikeUseCommentCase = require('../../../../Applications/use_case/LikeAndUnlikeCommentUseCase');

class CommentLikesHandler {
  constructor(container) {
    this._container = container;

    this.putCommentLikeByIdHandler = this.putCommentLikeByIdHandler.bind(this);
  }

  async putCommentLikeByIdHandler(request, h) {
    const {threadId, commentId} = request.params;
    const payload = {
      threadId: threadId,
      commentId: commentId,
      owner: request.auth.credentials.id,
    };

    const likeAndUnlikeCommentUseCase = this._container.getInstance(
        LikeAndUnlikeUseCommentCase.name,
    );

    await likeAndUnlikeCommentUseCase.execute(payload);

    return h
        .response({
          status: 'success',
        })
        .code(200);
  }
}

module.exports = CommentLikesHandler;
