const ReplyCommentDelete = require('../../../Domains/replies/entities/ReplyCommentDelete');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ReplyCommentDeleteUseCase = require('../ReplyCommentDeleteUseCase');

describe('ReplyCommentDeleteUseCase', () => {
  it('should orchestrating the delete replyComment action correctly', async () => {
    // arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
      owner: 'user-123',
    };

    const responseExpected = {
      status: 'succes',
    };

    /** creating dependency of use case */
    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadExist = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyCommentExist = jest.fn(() => Promise.resolve());
    mockReplyRepository.verifyReplyExist = jest.fn(() => Promise.resolve());
    mockReplyRepository.verifyReplyOwner = jest.fn(() => Promise.resolve());
    mockReplyRepository.deleteReplyCommentById = jest.fn(() => Promise.resolve());

    /** creating use case instance */
    const replyCommentDeleteUseCase = new ReplyCommentDeleteUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const reslut = await replyCommentDeleteUseCase.execute(new ReplyCommentDelete(useCasePayload));

    // Assert
    // expect(reslut).toStrictEqual(responseExpected);
    expect(mockThreadRepository.verifyThreadExist).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyCommentExist).toBeCalledWith(useCasePayload.commentId);
    expect(mockReplyRepository.verifyReplyExist).toBeCalledWith(useCasePayload.replyId);

    expect(mockReplyRepository.verifyReplyOwner)
      .toBeCalledWith(useCasePayload.replyId, useCasePayload.owner);

    expect(mockReplyRepository.deleteReplyCommentById).toBeCalledWith(useCasePayload.replyId);
  });
});
