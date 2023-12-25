const CommentLikeRepository = require('../../../Domains/comment_likes/CommentLikeRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const LikeAndUnlikeUseCommentCase = require('../LikeAndUnlikeCommentUseCase');

describe('LikeUnlikeUseCase', () => {
  it('should orchestrating the like action correctly', async () => {
    // Arange
    const payload = {
      owner: 'user-123',
      commentId: 'comment-123',
      threadId: 'thread-123',
    };

    const mockCommentRepository = new CommentRepository();
    const mockCommentLikeRepository = new CommentLikeRepository();

    mockCommentRepository.isCommentExist = jest.fn(() =>
      Promise.resolve(),
    );
    mockCommentLikeRepository.isCommentLiked = jest.fn(() =>
      Promise.resolve(false),
    );
    mockCommentLikeRepository.likeComment = jest.fn(() => Promise.resolve());

    const likeUnlikeUseCase = new LikeAndUnlikeUseCommentCase({
      commentRepository: mockCommentRepository,
      commentLikeRepository: mockCommentLikeRepository,
    });

    // Action
    await likeUnlikeUseCase.execute(payload);

    // Assert
    expect(mockCommentRepository.isCommentExist).toBeCalledWith(
        payload.commentId,
        payload.threadId,
    );
    expect(mockCommentLikeRepository.isCommentLiked).toBeCalledWith(
        payload.commentId,
        payload.owner,
    );
    expect(mockCommentLikeRepository.likeComment).toBeCalledWith(
        payload.commentId,
        payload.owner,
    );
  });

  it('should orchestrating the unlike action correctly', async () => {
    // Arange
    const payload = {
      owner: 'user-123',
      commentId: 'comment-123',
      threadId: 'thread-123',
    };

    const mockCommentRepository = new CommentRepository();
    const mockCommentLikeRepository = new CommentLikeRepository();

    mockCommentRepository.isCommentExist = jest.fn(() =>
      Promise.resolve(),
    );
    mockCommentLikeRepository.isCommentLiked = jest.fn(() =>
      Promise.resolve(true),
    );
    mockCommentLikeRepository.unlikeComment = jest.fn(() => Promise.resolve());

    const likeUnlikeUseCase = new LikeAndUnlikeUseCommentCase({
      commentRepository: mockCommentRepository,
      commentLikeRepository: mockCommentLikeRepository,
    });

    // Action
    await likeUnlikeUseCase.execute(payload);

    // Assert
    expect(mockCommentRepository.isCommentExist).toBeCalledWith(
        payload.commentId,
        payload.threadId,
    );
    expect(mockCommentLikeRepository.isCommentLiked).toBeCalledWith(
        payload.commentId,
        payload.owner,
    );
    expect(mockCommentLikeRepository.unlikeComment).toBeCalledWith(
        payload.commentId,
        payload.owner,
    );
  });
});
