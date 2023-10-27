const LikeAdd = require('../LikeAdd');

describe('Like Add Entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      commentId: 'comment-123',
      owner: 'user-123',
    };

    expect(() => new LikeAdd(payload)).toThrowError('LIKE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      threadId: 123,
      commentId: 'comment-123',
      owner: 'user-123',
    };

    expect(() => new LikeAdd(payload)).toThrowError('LIKE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  it('should add like whem entities correctly', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    // Action
    const { threadId, commentId, owner } = new LikeAdd(payload);

    // Assert
    expect(threadId).toEqual(payload.threadId);
    expect(commentId).toEqual(payload.commentId);
    expect(owner).toEqual(payload.owner);
  });
});
