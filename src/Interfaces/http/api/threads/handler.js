const AddCommentReplyUseCase = require('../../../../Applications/use_case/AddCommentReplyUseCase');
const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const AddNewThreadUseCase = require('../../../../Applications/use_case/AddNewThreadUseCase');
const DeleteCommentReplyUseCase = require('../../../../Applications/use_case/DeleteCommentReplyUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');
const GetThreadDetailUseCase = require('../../../../Applications/use_case/GetThreadDetailUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);

    this.postThreadCommentByIdHandler =
      this.postThreadCommentByIdHandler.bind(this);

    this.deleteCommentFromThreadHandler =
      this.deleteCommentFromThreadHandler.bind(this);

    this.getThreadDetailByIdHandler =
      this.getThreadDetailByIdHandler.bind(this);

    this.postThreadCommentReplyByIdHandler =
      this.postThreadCommentReplyByIdHandler.bind(this);

    this.deleteCommentReplyFromCommentHandler =
      this.deleteCommentReplyFromCommentHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const payload = {
      ...request.payload,
      owner: request.auth.credentials.id,
    };

    const addNewThreadUseCase = this._container.getInstance(
        AddNewThreadUseCase.name,
    );
    const addedThread = await addNewThreadUseCase.execute(payload);

    return h
        .response({
          status: 'success',
          data: {
            addedThread,
          },
        })
        .code(201);
  }

  async postThreadCommentByIdHandler(request, h) {
    const {id: threadId} = request.params;
    const payload = {
      ...request.payload,
      owner: request.auth.credentials.id,
      threadId: threadId,
    };

    const addCommentUseCase = this._container.getInstance(
        AddCommentUseCase.name,
    );
    const addedComment = await addCommentUseCase.execute(payload);

    return h
        .response({
          status: 'success',
          data: {
            addedComment,
          },
        })
        .code(201);
  }

  async deleteCommentFromThreadHandler(request, h) {
    const {threadId, commentId} = request.params;
    const owner = request.auth.credentials.id;

    const deleteCommentUseCase = this._container.getInstance(
        DeleteCommentUseCase.name,
    );
    await deleteCommentUseCase.execute({id: commentId, threadId, owner});

    return h
        .response({
          status: 'success',
        })
        .code(200);
  }

  async getThreadDetailByIdHandler(request, h) {
    const {id: threadId} = request.params;

    const getThreadDetailUseCase = this._container.getInstance(
        GetThreadDetailUseCase.name,
    );
    const thread = await getThreadDetailUseCase.execute({threadId: threadId});

    return h
        .response({
          status: 'success',
          data: {
            thread,
          },
        })
        .code(200);
  }

  async postThreadCommentReplyByIdHandler(request, h) {
    const {threadId, commentId} = request.params;
    const payload = {
      ...request.payload,
      owner: request.auth.credentials.id,
      threadId: threadId,
      commentId: commentId,
    };

    const addCommentReplyUseCase = this._container.getInstance(
        AddCommentReplyUseCase.name,
    );

    const addedReply = await addCommentReplyUseCase.execute(payload);

    return h
        .response({
          status: 'success',
          data: {
            addedReply,
          },
        })
        .code(201);
  }

  async deleteCommentReplyFromCommentHandler(request, h) {
    const {threadId, commentId, replyId} = request.params;
    const owner = request.auth.credentials.id;

    const deleteCommentReplyUseCase = this._container.getInstance(
        DeleteCommentReplyUseCase.name,
    );
    await deleteCommentReplyUseCase.execute({
      id: replyId,
      threadId,
      commentId,
      owner,
    });

    return h
        .response({
          status: 'success',
        })
        .code(200);
  }
}

module.exports = ThreadsHandler;
