const DeleteComment = require('../../../Domains/comments/entities/CommentDelete');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DeleteCommentUseCase = require('../CommentDeleteUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const mockDeteledComment = {
      status: 'success',
    };

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadExist = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyCommentExist = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyCommentOwner = jest.fn(() => Promise.resolve());
    mockCommentRepository.deleteCommentById = jest.fn(() => Promise.resolve());

    /** creating use case instance */
    const getDeleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const deletedComment = await getDeleteCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadExist).toBeCalledWith(useCasePayload.threadId);

    expect(mockCommentRepository.verifyCommentExist).toBeCalledWith(useCasePayload.commentId);

    expect(mockCommentRepository.verifyCommentOwner)
      .toBeCalledWith(useCasePayload.commentId, useCasePayload.owner);

    expect(mockCommentRepository.deleteCommentById)
      .toBeCalledWith(useCasePayload.commentId);
  });
});
