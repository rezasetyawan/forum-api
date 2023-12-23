class DeleteCommentReplyUseCase {
  constructor({ commentRepository, commentReplyRepository }) {
    this._commentRepository = commentRepository;
    this._commentReplyRepository = commentReplyRepository;
  }

  async execute(useCasePayload) {
    const { id, commentId, threadId, owner } = useCasePayload;

    await this._commentRepository.isCommentExist(commentId, threadId);
    await this._commentReplyRepository.isCommentReplyExist(id, threadId);
    await this._commentReplyRepository.verifyCommentReplyOwner(id, owner);
    await this._commentReplyRepository.deleteCommentReplyById(id);
  }
}

module.exports = DeleteCommentReplyUseCase;
