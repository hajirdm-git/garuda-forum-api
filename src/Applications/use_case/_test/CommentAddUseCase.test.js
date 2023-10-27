const CommentAdd = require('../../../Domains/comments/entities/CommentAdd');
const CommentAdded = require('../../../Domains/comments/entities/CommentAdded');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const CommentAddUseCase = require('../CommentAddUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('ThreadAddUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'comment-123',
      content: 'comment content',
      owner: 'user-123',
    };

    const responseExpected = new CommentAdded({
      id: 'comment-123',
      content: 'comment content',
      owner: 'user-123',
    });

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockCommentRepository.addComment = jest.fn(() => Promise.resolve(responseExpected));
    mockThreadRepository.verifyThreadExist = jest.fn(() => Promise.resolve());

    /** creating use case instance */
    const getCommentAddUseCase = new CommentAddUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const result = await getCommentAddUseCase.execute(useCasePayload);

    // Assert
    expect(result).toStrictEqual(new CommentAdded({
      id: 'comment-123',
      content: 'comment content',
      owner: 'user-123',
    }));

    expect(mockCommentRepository.addComment).toBeCalledWith(new CommentAdd(useCasePayload));
    expect(mockThreadRepository.verifyThreadExist).toBeCalledWith(useCasePayload.threadId);
  });
});
