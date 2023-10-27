const ReplyCommentDelete = require('../../Domains/replies/entities/ReplyCommentDelete');

class ReplyCommentDeleteUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const {
      threadId, commentId, replyId, owner,
    } = new ReplyCommentDelete(useCasePayload);

    await this._threadRepository.verifyThreadExist(threadId);
    await this._commentRepository.verifyCommentExist(commentId);
    await this._replyRepository.verifyReplyExist(replyId);
    await this._replyRepository.verifyReplyOwner(replyId, owner);
    await this._replyRepository.deleteReplyCommentById(replyId);
  }
}

module.exports = ReplyCommentDeleteUseCase;
