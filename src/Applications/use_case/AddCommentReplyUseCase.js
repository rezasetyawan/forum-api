/* eslint-disable require-jsdoc */
const AddCommentReply = require('../../Domains/comment_replies/entities/AddCommentReply');
const AddedCommentReply = require('../../Domains/comment_replies/entities/AddedCommentReply');

class AddCommentReplyUseCase {
  constructor({threadRepository, commentRepository, commentReplyRepository}) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._commentReplyRepository = commentReplyRepository;
  }

  async execute(useCasePayload) {
    const newCommentReply = new AddCommentReply(useCasePayload);
    await this._threadRepository.isThreadExist(useCasePayload.threadId);
    await this._commentRepository.isCommentExist(
        useCasePayload.commentId,
        useCasePayload.threadId,
    );

    const addedCommentReply =
      await this._commentReplyRepository.addCommentReply(newCommentReply);

    return new AddedCommentReply(addedCommentReply);
  }
}
module.exports = AddCommentReplyUseCase;
