const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentReplyRepository = require("../../../Domains/comment_replies/CommentReplyRepository");
const AddedCommentReply = require("../../../Domains/comment_replies/entities/AddedCommentReply");
const AddCommentReply = require("../../../Domains/comment_replies/entities/AddCommentReply");
const AddCommentReplyUseCase = require("../AddCommentReplyUseCase");

describe("AddCommentReply interface", () => {
  it("should orchestrating the add comment action correctly", async () => {
    // Arrange
    const payload = {
      content: "test reply comment",
      owner: "user-123",
      threadId: "thread-123",
      commentId: "comment-123",
    };

    const addedCommentReply = new AddedCommentReply({
      id: "comment-123",
      content: "test reply comment",
      owner: "user-123",
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockCommentReplyRepository = new CommentReplyRepository();

    mockThreadRepository.isThreadExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.isCommentExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentReplyRepository.addCommentReply = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve(
          new AddedCommentReply({
            id: "comment-123",
            content: "test reply comment",
            owner: "user-123",
          })
        )
      );

    const addCommentReplyUseCase = new AddCommentReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      commentReplyRepository: mockCommentReplyRepository,
    });

    // Action
    const result = await addCommentReplyUseCase.execute(payload);

    // Assert
    expect(result).toStrictEqual(addedCommentReply);
    expect(mockThreadRepository.isThreadExist).toBeCalledWith(payload.threadId);
    expect(mockCommentRepository.isCommentExist).toBeCalledWith(
      payload.commentId,
      payload.threadId
    );
    expect(mockCommentReplyRepository.addCommentReply).toBeCalledWith(
      new AddCommentReply({
        content: payload.content,
        owner: payload.owner,
        threadId: payload.threadId,
        commentId: payload.commentId,
      })
    );
  });
});
