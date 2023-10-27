const ThreadAdd = require('../ThreadAdd');

describe('NewThread Entities', () => {
  it('should throw error when payload not contain needed property', () => {
    const payload = {
      title: 'judul thread',
      owner: 'user-123',
    };

    expect(() => new ThreadAdd(payload)).toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    const payload = {
      title: 'judul thread',
      body: 12345,
      owner: 'user-123',
    };

    expect(() => new ThreadAdd(payload)).toThrowError('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should add thread entities correctly', () => {
    const payload = {
      title: 'judul thread',
      body: 'isi thread',
      owner: 'user-123',
    };

    // Action
    const { title, body, owner } = new ThreadAdd(payload);

    // Assert
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(owner).toEqual(payload.owner);
  });
});
