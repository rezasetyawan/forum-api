const AddComment = require('../AddComment');

describe('a AddComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      content: 'test thread comment',
    };

    expect(() => new AddComment(payload)).toThrowError(
        'ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      content: 'test thread comment',
      owner: 'user-123',
      threadId: {},
    };

    expect(() => new AddComment(payload)).toThrowError(
        'ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create addComment object correctly', () => {
    const payload = {
      content: 'test thread comment',
      owner: 'user-123',
      threadId: 'thread-123',
    };

    const addComment = new AddComment(payload);

    expect(addComment.content).toEqual(payload.content);
    expect(addComment.owner).toEqual(payload.owner);
    expect(addComment.threadId).toEqual(payload.threadId);
  });
});
