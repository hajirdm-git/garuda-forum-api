const ThreadRepository = require('../ThreadRepository');

describe('ThreadRepository Interface', () => {
  it('should throw error when invoke unimplemented method', async () => {
    // Arrange
    const threadRepository = new ThreadRepository();

    // Action & Assert
    await expect(threadRepository.addThread(''))
      .rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');

    await expect(threadRepository.verifyThreadExist(''))
      .rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');

    await expect(threadRepository.verifyThreadOwner(''))
      .rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');

    await expect(threadRepository.getDetailThreadById(''))
      .rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
