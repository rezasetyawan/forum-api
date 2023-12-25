const CommentRepository = require('../CommentRepository');

describe('CommentRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const commentRepository = new CommentRepository();

    // Action and Assert
    await expect(commentRepository.addComment({})).rejects.toThrowError(
        'COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );

    await expect(
        commentRepository.isCommentExist('itsnotacomment'),
    ).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');

    await expect(
        commentRepository.verifyCommentOwner('itsnotacomment', 'itsnotauser'),
    ).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');

    await expect(
        commentRepository.deleteCommentById('itsnotacomment'),
    ).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');

    await expect(
        commentRepository.getCommentsByThreadId('itsnotathread'),
    ).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
