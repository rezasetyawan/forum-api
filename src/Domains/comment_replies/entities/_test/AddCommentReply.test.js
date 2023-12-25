const AddCommentReply = require('../AddCommentReply');

describe('a AddCommnetReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      content: 'test thread comment',
    };

    expect(() => new AddCommentReply(payload)).toThrowError(
        'ADD_COMMENT_REPLY.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      content: 'test thread comment',
      owner: 'user-123',
      threadId: {},
      commentId: 'comment-123',
    };

    expect(() => new AddCommentReply(payload)).toThrowError(
        'ADD_COMMENT_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create addCommentReply object correctly', () => {
    const payload = {
      content: 'test thread comment',
      owner: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    const addCommentReply = new AddCommentReply(payload);

    expect(addCommentReply.content).toEqual(payload.content);
    expect(addCommentReply.owner).toEqual(payload.owner);
    expect(addCommentReply.threadId).toEqual(payload.threadId);
    expect(addCommentReply.commentId).toEqual(payload.commentId);
  });
});
