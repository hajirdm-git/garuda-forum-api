const ReplyComment = require('../../Domains/replies/entities/ReplyCommentAdd');

class AddReplyCommentUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const { threadId, commentId, owner } = useCasePayload;
    const replyComment = new ReplyComment(useCasePayload);
    await this._threadRepository.verifyThreadExist(threadId);
    await this._commentRepository.verifyCommentExist(commentId, owner);

    const result = await this._replyRepository.addReplyComment(replyComment);
    return result;
  }
}

module.exports = AddReplyCommentUseCase;
