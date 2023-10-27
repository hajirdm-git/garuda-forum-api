const CommentAdded = require('../CommentAdded');

describe('CommentAdded Entities', () => {
  it('should throw error when payload not contain needed property', () => {
    const payload = {
      content: 'comment content',
      owner: 'user-123',
    };

    expect(() => new CommentAdded(payload)).toThrowError('NEW_COMMENT_ADDED.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    const payload = {
      id: 1234,
      content: 'comment content',
      owner: 'user-123',
    };

    expect(() => new CommentAdded(payload)).toThrowError('NEW_COMMENT_ADDED.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should add comment entities correctly', () => {
    const payload = {
      id: 'comment-123',
      content: 'comment content',
      owner: 'user-123',
    };

    // Action
    const { id, content, owner } = new CommentAdded(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
