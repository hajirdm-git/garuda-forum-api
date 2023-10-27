/* eslint-disable no-param-reassign */
class MarkCommentDeleted {
  constructor(comments) {
    const markedComments = this._markAsDeleted(comments);
    this.comments = markedComments;
  }

  returnMarked() {
    return this.comments;
  }

  _markAsDeleted(comments) {
    comments.forEach((comment) => {
      if (comment.isDelete) {
        comment.content = '**komentar telah dihapus**';
      }
    });

    return comments;
  }
}

module.exports = MarkCommentDeleted;
