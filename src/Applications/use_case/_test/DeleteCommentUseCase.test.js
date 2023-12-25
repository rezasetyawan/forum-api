const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'comment-123',
      owner: 'user-123',
      threadId: 'thread-123',
    };

    const mockCommentRepository = new CommentRepository();

    mockCommentRepository.isCommentExist = jest
        .fn()
        .mockImplementation(() => Promise.resolve());

    mockCommentRepository.verifyCommentOwner = jest
        .fn()
        .mockImplementation(() => Promise.resolve());

    mockCommentRepository.deleteCommentById = jest
        .fn()
        .mockImplementation(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    await deleteCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockCommentRepository.isCommentExist).toBeCalledWith(
        useCasePayload.id,
        useCasePayload.threadId,
    );
    expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(
        useCasePayload.id,
        useCasePayload.owner,
    );
    expect(mockCommentRepository.deleteCommentById).toBeCalledWith(
        useCasePayload.id,
    );
  });
});
