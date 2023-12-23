const CommentRepository = require("../../../Domains/comments/CommentRepository");
const AddedComment = require("../../../Domains/comments/entities/AddedComment");
const AddComment = require("../../../Domains/comments/entities/AddComment");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const AddCommentUseCase = require("../AddCommentUseCase");

describe("AddComment interface", () => {
  it("should orchestrating the add comment action correctly", async () => {
    // Arrange
    const payload = {
      content: "test comment",
      owner: "user-123",
      threadId: "thread-123",
    };

    const addedComment = new AddedComment({
      id: "comment-123",
      content: "test comment",
      owner: "user-123",
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.isThreadExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.addComment = jest.fn().mockImplementation(() =>
      Promise.resolve(
        new AddedComment({
          id: "comment-123",
          content: "test comment",
          owner: "user-123",
        })
      )
    );

    const addCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const result = await addCommentUseCase.execute(payload);

    // Assert
    expect(result).toStrictEqual(addedComment);
    expect(mockThreadRepository.isThreadExist).toBeCalledWith(payload.threadId);
    expect(mockCommentRepository.addComment).toBeCalledWith(
      new AddComment({
        content: payload.content,
        owner: payload.owner,
        threadId: payload.threadId,
      })
    );
  });
});
