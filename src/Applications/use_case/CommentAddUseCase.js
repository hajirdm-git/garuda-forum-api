const CommentAdd = require('../../Domains/comments/entities/CommentAdd');

class CommentAddUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const addComment = new CommentAdd(useCasePayload);
    await this._threadRepository.verifyThreadExist(addComment.threadId);
    const result = await this._commentRepository.addComment(addComment);
    return result;
  }
}

module.exports = CommentAddUseCase;
