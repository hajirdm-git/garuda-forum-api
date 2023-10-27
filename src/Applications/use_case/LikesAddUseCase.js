const LikeAdd = require('../../Domains/likes/entities/LikeAdd');

class LikeAddUseCase {
  constructor({ threadRepository, commentRepository, likeRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._likeRepository = likeRepository;
  }

  async execute(useCasePayload) {
    const payload = new LikeAdd(useCasePayload);
    await this._threadRepository.verifyThreadExist(payload.threadId);
    await this._commentRepository.verifyCommentExist(payload.commentId);
    const isLike = await this._likeRepository.checkIsLike(payload);

    if (isLike) {
      await this._likeRepository.removeLike(payload);
    } else {
      await this._likeRepository.addLike(payload);
    }
  }
}
module.exports = LikeAddUseCase;
