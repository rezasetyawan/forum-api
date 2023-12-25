const CommentReplyRepository = require('../../../Domains/comment_replies/CommentReplyRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DeleteCommentReplyUseCase = require('../DeleteCommentReplyUseCase');

describe('DeleteCommentReplyUseCase', () => {
  it('should orchestrating the delete comment reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'reply-123',
      owner: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    const mockCommentRepository = new CommentRepository();
    const mockCommentReplyRepository = new CommentReplyRepository();

    mockCommentRepository.isCommentExist = jest
        .fn()
        .mockImplementation(() => Promise.resolve());

    mockCommentReplyRepository.isCommentReplyExist = jest
        .fn()
        .mockImplementation(() => Promise.resolve());

    mockCommentReplyRepository.verifyCommentReplyOwner = jest
        .fn()
        .mockImplementation(() => Promise.resolve());

    mockCommentReplyRepository.deleteCommentReplyById = jest
        .fn()
        .mockImplementation(() => Promise.resolve());

    const deleteCommentReplyUseCase = new DeleteCommentReplyUseCase({
      commentRepository: mockCommentRepository,
      commentReplyRepository: mockCommentReplyRepository,
    });

    // Action
    await deleteCommentReplyUseCase.execute(useCasePayload);

    // Assert
    expect(mockCommentRepository.isCommentExist).toBeCalledWith(
        useCasePayload.commentId,
        useCasePayload.threadId,
    );

    expect(mockCommentReplyRepository.isCommentReplyExist).toBeCalledWith(
        useCasePayload.id,
        useCasePayload.threadId,
    );
    expect(mockCommentReplyRepository.verifyCommentReplyOwner).toBeCalledWith(
        useCasePayload.id,
        useCasePayload.owner,
    );
    expect(mockCommentReplyRepository.deleteCommentReplyById).toBeCalledWith(
        useCasePayload.id,
    );
  });
});
