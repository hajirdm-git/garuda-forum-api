const ReplyCommentMarkedDelete = require('../RepliesMarkedDelete');

describe('CommentMarkDeleted', () => {
  it('should mark the passed comments correctly', () => {
    // Arrange
    const payload = [
      {
        id: 'reply-123',
        username: 'dicoding',
        content: 'reply content',
        date: '2021-08-08T07:22:33.555Z',
        isDelete: false,
        commentId: 'comment-yksuCoxM2s4MMrZJO-qVD',
      },
      {
        id: 'reply-456',
        username: 'newdicoding',
        content: 'reply content 2',
        date: '2021-08-08T07:22:33.555Z',
        isDelete: true,
        commentId: 'comment-yksuCoxM2s4MMrZJO-qVD',
      },
    ];

    // Action
    const markedReplies = new ReplyCommentMarkedDelete(payload).returnMarked();

    // Assert
    expect(markedReplies).toBeDefined();
    expect(markedReplies).toHaveLength(2);

    expect(markedReplies[0].id).toEqual(payload[0].id);
    expect(markedReplies[0].username).toEqual(payload[0].username);
    expect(markedReplies[0].date).toEqual(payload[0].date);
    expect(markedReplies[0].content).toEqual(payload[0].content);
    expect(markedReplies[0].isDelete).toEqual(payload[0].isDelete);
    expect(markedReplies[0].commentId).toEqual(payload[0].commentId);

    expect(markedReplies[1].id).toEqual(payload[1].id);
    expect(markedReplies[1].username).toEqual(payload[1].username);
    expect(markedReplies[1].date).toEqual(payload[1].date);
    expect(markedReplies[1].content).toEqual('**balasan telah dihapus**');
    expect(markedReplies[1].isDelete).toEqual(payload[1].isDelete);
    expect(markedReplies[1].commentId).toEqual(payload[0].commentId);
  });
});
