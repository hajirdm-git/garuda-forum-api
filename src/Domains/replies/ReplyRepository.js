/* eslint-disable no-unused-vars */
class ReplyRepository {
  async addReplyComment(payload) {
    throw new Error('ADD_REPLY_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async deleteReplyCommentById(replyId) {
    throw new Error('DELETE_REPLY_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyReplyExist(replyId) {
    throw new Error('DELETE_REPLY_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyReplyOwner(replyId, owner) {
    throw new Error('DELETE_REPLY_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getRepliesByCommentIds(commentIds) {
    throw new Error('DELETE_REPLY_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = ReplyRepository;
