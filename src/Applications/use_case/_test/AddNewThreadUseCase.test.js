const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const AddNewThreadUseCase = require('../AddNewThreadUseCase');

describe('AddNewThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    const newThreadPayload = {
      title: 'test thread',
      body: 'lagi test thread banh',
      owner: 'user-123',
    };

    const expectedAddedThread = new AddedThread({
      id: 'thread-123',
      title: newThreadPayload.title,
      owner: newThreadPayload.owner,
    });

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.addThread = jest.fn(() =>
      Promise.resolve(
          new AddedThread({
            id: 'thread-123',
            title: newThreadPayload.title,
            owner: newThreadPayload.owner,
          }),
      ),
    );

    const addNeAddNewThreadUseCase = new AddNewThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    const addedThread = await addNeAddNewThreadUseCase.execute(
        newThreadPayload,
    );

    expect(addedThread).toStrictEqual(expectedAddedThread);
    expect(mockThreadRepository.addThread).toBeCalledWith(
        new AddThread({
          title: newThreadPayload.title,
          body: newThreadPayload.body,
          owner: newThreadPayload.owner,
        }),
    );
  });
});
