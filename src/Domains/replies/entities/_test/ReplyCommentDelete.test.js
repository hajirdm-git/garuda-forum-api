const DeleteReplyComment = require('../ReplyCommentDelete');

describe('DeleteReplyComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new DeleteReplyComment(payload)).toThrowError('DELETE_REPLY_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      commentId: 123,
      replyId: 'reply-123',
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new DeleteReplyComment(payload)).toThrowError('DELETE_REPLY_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should delete reply comment object correctly', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
      owner: 'user-123',
    };

    // Action
    const {
      threadId, commentId, replyId, owner,
    } = new DeleteReplyComment(payload);

    // Assert
    expect(threadId).toEqual(payload.threadId);
    expect(commentId).toEqual(payload.commentId);
    expect(replyId).toEqual(payload.replyId);
    expect(owner).toEqual(payload.owner);
  });
});
