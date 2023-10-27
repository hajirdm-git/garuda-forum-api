const CommentAdd = require('../CommentAdd');

describe('Comment Add Entities', () => {
  it('should throw error when payload not contain needed property', () => {
    const payload = {
      content: 'comment content',
      owner: 'user-123',
    };

    expect(() => new CommentAdd(payload)).toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    const payload = {
      threadId: 1234,
      content: 'comment content',
      owner: 'user-123',
    };

    expect(() => new CommentAdd(payload)).toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should add comment entities correctly', () => {
    const payload = {
      threadId: 'thread-123',
      content: 'comment content',
      owner: 'user-123',
    };

    // Action
    const { threadId, content, owner } = new CommentAdd(payload);

    // Assert
    expect(threadId).toEqual(payload.threadId);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
