/* eslint-disable no-param-reassign */
class MarkRepliestDeleted {
  constructor(replies) {
    const markedReplies = this._markAsDeleted(replies);
    this.replies = markedReplies;
  }

  returnMarked() {
    return this.replies;
  }

  _markAsDeleted(replies) {
    replies.forEach((reply) => {
      if (reply.isDelete) {
        reply.content = '**balasan telah dihapus**';
      }
      delete reply.isDelete;
      delete reply.commentId;
    });

    return replies;
  }
}

module.exports = MarkRepliestDeleted;
