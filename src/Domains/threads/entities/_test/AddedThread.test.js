const AddedThread = require('../AddedThread');

describe('an AddedThread entity', () => {
  it('should throw error if payload does not meet criteria', () => {
    const payload = {
      id: 'thread-1',
      title: 'test thread',
    };

    expect(() => new AddedThread(payload)).toThrowError(
        'ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload has invalid data type', () => {
    const payload = {
      id: 'thread-1',
      title: 121212,
      owner: {},
    };

    expect(() => new AddedThread(payload)).toThrowError(
        'ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create AddedThread object correctly', () => {
    const payload = {
      id: 'thread-1',
      title: 'test thread',
      owner: 'lagi test thread banh',
    };

    const addedThread = new AddedThread(payload);

    expect(addedThread.id).toEqual(payload.id);
    expect(addedThread.title).toEqual(payload.title);
    expect(addedThread.owner).toEqual(payload.owner);
  });
});
