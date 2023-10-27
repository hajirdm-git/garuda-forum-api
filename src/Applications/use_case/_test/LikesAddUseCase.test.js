const LikeRepository = require('../../../Domains/likes/LikeRepository');
const LikeAdd = require('../../../Domains/likes/entities/LikeAdd');
const LikeAddUseCase = require('../LikesAddUseCase');

const ThreadReapositoy = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('Like Add Use case', () => {
  // Arrange
  const useCasePayload = {
    threadId: 'thread-123',
    commentId: 'comment-123',
    owner: 'user-123',
  };

  /** creating dependency of use case */
  const mockThreadRepository = new ThreadReapositoy();
  const mockCommentRepository = new CommentRepository();
  const mockLikeRepository = new LikeRepository();

  /** mocking needed function */
  mockThreadRepository.verifyThreadExist = jest.fn(() => Promise.resolve());
  mockCommentRepository.verifyCommentExist = jest.fn(() => Promise.resolve());
  mockLikeRepository.addLike = jest.fn(() => Promise.resolve());
  mockLikeRepository.checkIsLike = jest.fn(() => Promise.resolve(isLike));
  mockLikeRepository.removeLike = jest.fn(() => Promise.resolve());

  /** creating use case instance */
  const likeAddUseCase = new LikeAddUseCase({
    threadRepository: mockThreadRepository,
    commentRepository: mockCommentRepository,
    likeRepository: mockLikeRepository,
  });

  it('should orchestrating the add like action correctly when isLike =  false', async () => {
    const isLike = false;

    /** mocking needed function */
    mockLikeRepository.checkIsLike = jest.fn(() => Promise.resolve(isLike));

    // Action
    await likeAddUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadExist).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyCommentExist).toBeCalledWith(useCasePayload.commentId);
    expect(mockLikeRepository.checkIsLike).toBeCalledWith(useCasePayload);
    if (isLike) {
      expect(mockLikeRepository.removeLike).toBeCalledWith(useCasePayload);
      expect(mockLikeRepository.addLike).not.toBeCalledWith();
    } else {
      expect(mockLikeRepository.removeLike).not.toBeCalledWith();
      expect(mockLikeRepository.addLike).toBeCalledWith(useCasePayload);
    }
  });

  it('should orchestrating the add like action correctly when isLike =  true', async () => {
    const isLike = true;

    /** mocking needed function */
    mockLikeRepository.checkIsLike = jest.fn(() => Promise.resolve(isLike));
    mockLikeRepository.removeLike = jest.fn(() => Promise.resolve());

    // Action
    await likeAddUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadExist).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyCommentExist).toBeCalledWith(useCasePayload.commentId);
    expect(mockLikeRepository.checkIsLike).toBeCalledWith(useCasePayload);
    if (isLike) {
      expect(mockLikeRepository.removeLike).toBeCalledWith(useCasePayload);
      expect(mockLikeRepository.addLike).not.toBeCalledWith();
    } else {
      expect(mockLikeRepository.removeLike).not.toBeCalledWith();
      expect(mockLikeRepository.addLike).toBeCalledWith(useCasePayload);
    }
  });
});
