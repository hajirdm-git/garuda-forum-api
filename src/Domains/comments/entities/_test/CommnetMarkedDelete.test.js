const CommentMarkDeleted = require('../CommentMarkedDelete');

describe('CommentMarkDeleted', () => {
  it('should mark the passed comments correctly', () => {
    // Arrange
    const payload = [
      {
        id: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'johndoe',
        date: '2021-08-08T07:22:33.555Z',
        content: 'sebuah comment',
        isDelete: false,
      },
      {
        id: 'comment-yksuCoxM2s4MMrZJO-qVD',
        username: 'dicoding',
        date: '2021-08-08T07:26:21.338Z',
        content: 'comment yang akan di hapus',
        isDelete: true,
      },
    ];

    // Action
    const markedComments = new CommentMarkDeleted(payload).returnMarked();

    // Assert
    expect(markedComments).toBeDefined();
    expect(markedComments).toHaveLength(2);

    expect(markedComments[0].id).toEqual(payload[0].id);
    expect(markedComments[0].username).toEqual(payload[0].username);
    expect(markedComments[0].date).toEqual(payload[0].date);
    expect(markedComments[0].content).toEqual(payload[0].content);
    expect(markedComments[0].isDelete).toEqual(payload[0].isDelete);

    expect(markedComments[1].id).toEqual(payload[1].id);
    expect(markedComments[1].username).toEqual(payload[1].username);
    expect(markedComments[1].date).toEqual(payload[1].date);
    expect(markedComments[1].content).toEqual('**komentar telah dihapus**');
    expect(markedComments[1].isDelete).toEqual(payload[1].isDelete);
  });
});
