const ReplyRepository = require('../ReplyRepository');

describe('ReplyRepository', () => {
  it('should throw error when invoke unimplemented method', async () => {
    // Arrange
    const replyRepository = new ReplyRepository();

    // Action & Assert
    await expect(replyRepository.addReplyComment(''))
      .rejects.toThrowError('ADD_REPLY_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');

    await expect(replyRepository.deleteReplyCommentById(''))
      .rejects.toThrowError('DELETE_REPLY_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');

    await expect(replyRepository.verifyReplyExist(''))
      .rejects.toThrowError('DELETE_REPLY_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');

    await expect(replyRepository.verifyReplyOwner(''))
      .rejects.toThrowError('DELETE_REPLY_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');

    await expect(replyRepository.getRepliesByCommentIds(''))
      .rejects.toThrowError('DELETE_REPLY_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
