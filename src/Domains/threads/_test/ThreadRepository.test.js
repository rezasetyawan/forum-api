const ThreadRepository = require('../ThreadRepository');

describe('ThreadRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const threadRepository = new ThreadRepository();

    // Action and Assert
    await expect(threadRepository.addThread({})).rejects.toThrowError(
        'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );

    // must error right? because thread id is start with thread-...
    await expect(
        threadRepository.isThreadExist('ayo-temukan-aku'),
    ).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');

    await expect(threadRepository.getThreadDetailById('')).rejects.toThrowError(
        'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
  });
});
