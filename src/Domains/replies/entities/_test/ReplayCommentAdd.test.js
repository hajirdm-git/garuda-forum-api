const ReplyComment = require('../ReplyCommentAdd');

describe('ReplyComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      content: 'replay content',
    };

    // Action and Assert
    expect(() => new ReplyComment(payload)).toThrowError('REPLY_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      threadId: 123,
      commentId: 'comment-123',
      content: 'replay content',
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new ReplyComment(payload)).toThrowError('REPLY_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should add reply object correctly', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      content: 'replay content',
      owner: 'user-123',
    };

    // Action
    const {
      threadId, commentId, content, owner,
    } = new ReplyComment(payload);

    // Assert
    expect(threadId).toEqual(payload.threadId);
    expect(commentId).toEqual(payload.commentId);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
