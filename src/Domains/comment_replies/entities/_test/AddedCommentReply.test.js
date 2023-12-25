const AddedCommentReply = require('../AddedCommentReply');

describe('an AddedCommentReply entity', () => {
  it('should throw error if payload doesn\'t have needed property', () => {
    const payload = {
      content: 'test thread comment',
      owner: 'user-123',
    };

    expect(() => new AddedCommentReply(payload)).toThrowError(
        'ADDED_COMMENT_REPLY.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload has invalid data type', () => {
    const payload = {
      content: 'test thread comment',
      owner: {},
      id: 'reply-123',
    };

    expect(() => new AddedCommentReply(payload)).toThrowError(
        'ADDED_COMMENT_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create addedCommentReply object correctly', () => {
    const payload = {
      content: 'test thread comment',
      owner: 'user-123',
      id: 'reply-123',
    };

    const addedCommentReply = new AddedCommentReply(payload);

    expect(addedCommentReply.content).toEqual(payload.content);
    expect(addedCommentReply.owner).toEqual(payload.owner);
    expect(addedCommentReply.id).toEqual(payload.id);
  });
});
