const CommentReplyRepository = require('../CommentReplyRepository');

describe('CommentReplyRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const commentReplyRepository = new CommentReplyRepository();

    // Action and Assert
    await expect(commentReplyRepository.addCommentReply({})).rejects.toThrowError(
        'COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );

    await expect(
        commentReplyRepository.isCommentReplyExist('itsnotacomment'),
    ).rejects.toThrowError('COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');

    await expect(
        commentReplyRepository.verifyCommentReplyOwner('itsnotacomment', 'itsnotauser'),
    ).rejects.toThrowError('COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');

    await expect(
        commentReplyRepository.deleteCommentReplyById('itsnotacomment'),
    ).rejects.toThrowError('COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');

    await expect(
        commentReplyRepository.getCommentRepliesByThreadId('itsnotathread'),
    ).rejects.toThrowError('COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
