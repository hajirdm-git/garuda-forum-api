const ThreadAdded = require('../ThreadAdded');

describe('TheadAdded Entities', () => {
  it('should throw error when payload not contain needed property', () => {
    const payload = {
      title: 'thread title',
      owner: 'user-123',
    };

    expect(() => new ThreadAdded(payload)).toThrowError('THREAD_ADDED.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    const payload = {
      id: 123,
      title: 'thread title',
      owner: 'user-123',
    };

    expect(() => new ThreadAdded(payload)).toThrowError('THREAD_ADDED.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should add thread entities correctly', () => {
    const payload = {
      id: 'thread-123',
      title: 'thread title',
      owner: 'user-123',
    };

    // Action
    const { id, title, owner } = new ThreadAdded(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(owner).toEqual(payload.owner);
  });
});
