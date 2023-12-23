const AddComment = require("../../Domains/comments/entities/AddComment");
const AddedComment = require("../../Domains/comments/entities/AddedComment");

class AddCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const newComment = new AddComment(useCasePayload);
    await this._threadRepository.isThreadExist(useCasePayload.threadId);

    const addedThread = await this._commentRepository.addComment(newComment);
    return new AddedComment(addedThread);
  }
}
module.exports = AddCommentUseCase;
