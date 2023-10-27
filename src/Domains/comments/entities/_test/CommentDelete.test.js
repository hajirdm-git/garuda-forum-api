const CommentDelete = require('../CommentDelete');

describe('CommentDelete entities', () => {
  it('should throw error when payload did not contain needed propert', () => {
    // Arrange
    const payload = {
      commentId: 'comment-123',
      threadId: 'thread-123',
    };

    // Action and Assert
    expect(() => new CommentDelete(payload)).toThrowError('COMMENT_DELETE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      commentId: 'comment-123',
      threadId: 'thread-123',
      owner: 123,
    };

    // Action and Assert
    expect(() => new CommentDelete(payload)).toThrowError('COMMENT_DELETE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create commentPost object correctly', () => {
    // Arrange
    const payload = {
      commentId: 'comment-123',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    // Action
    const { commentId, threadId, owner } = new CommentDelete(payload);

    // Assert
    expect(commentId).toEqual(payload.commentId);
    expect(threadId).toEqual(payload.threadId);
    expect(owner).toEqual(payload.owner);
  });
});
