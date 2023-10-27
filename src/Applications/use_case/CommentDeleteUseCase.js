const CommentDelete = require('../../Domains/comments/entities/CommentDelete');

class CommentDeleteUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute({ threadId, commentId, owner }) {
    const deleteComment = new CommentDelete({ threadId, commentId, owner });

    await this._threadRepository.verifyThreadExist(threadId);

    await this._commentRepository.verifyCommentExist(commentId);

    await this._commentRepository.verifyCommentOwner(commentId, owner);

    await this._commentRepository.deleteCommentById(deleteComment.commentId);
  }
}

module.exports = CommentDeleteUseCase;
