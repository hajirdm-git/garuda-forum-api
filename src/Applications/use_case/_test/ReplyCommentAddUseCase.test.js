const AddReplyCommentUseCase = require('../ReplyCommentAddUseCase');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('AddReplyCommentUseCase', () => {
  it('should orchestrating the add reply comment action correctly', async () => {
    // arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      content: 'reply content',
      owner: 'user-123',
    };

    const responseExpected = {
      id: 'reply-BErOXUSefjwWGW1Z10Ihk',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    };

    /** creating dependency of use case */
    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadExist = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyCommentExist = jest.fn(() => Promise.resolve());
    mockReplyRepository.addReplyComment = jest.fn(() => Promise.resolve(responseExpected));

    /** creating use case instance */
    const addReplyCommentUseCase = new AddReplyCommentUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const replyComment = await addReplyCommentUseCase.execute(useCasePayload);

    // Assert
    expect(replyComment).toStrictEqual(responseExpected);
    expect(mockReplyRepository.addReplyComment).toBeCalledWith(useCasePayload);
    expect(mockCommentRepository.verifyCommentExist)
      .toBeCalledWith(useCasePayload.commentId, useCasePayload.owner);

    expect(mockThreadRepository.verifyThreadExist).toBeCalledWith(useCasePayload.threadId);
  });
});
