const ThreadAdd = require('../../../Domains/threads/entities/ThreadAdd');
const ThreadAdded = require('../../../Domains/threads/entities/ThreadAdded');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadAddUseCase = require('../ThreadAddUseCase');

describe('ThreadAddUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'Thread title',
      body: 'thread content',
      owner: 'user-123',
    };

    const responseExpected = new ThreadAdded({
      id: 'thread-123',
      title: 'Thread title',
      owner: 'user-123',
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(responseExpected));

    /** creating use case instance */
    const getThreadAddUseCase = new ThreadAddUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const result = await getThreadAddUseCase.execute(useCasePayload);

    // Assert
    expect(result).toStrictEqual(new ThreadAdded({
      id: 'thread-123',
      title: 'Thread title',
      owner: 'user-123',
    }));

    expect(mockThreadRepository.addThread).toBeCalledWith(new ThreadAdd(useCasePayload));
  });
});
