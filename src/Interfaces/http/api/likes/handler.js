const LikesAddUseCase = require('../../../../Applications/use_case/LikesAddUseCase');

class LikesHandler {
  constructor(container) {
    this._container = container;

    this.putLikesHandler = this.putLikesHandler.bind(this);
  }

  async putLikesHandler(request, h) {
    const likeAddUseCase = this._container.getInstance(LikesAddUseCase.name);
    const { id: owner } = request.auth.credentials;
    const { threadId, commentId } = request.params;

    await likeAddUseCase.execute({ threadId, commentId, owner });

    const response = h.response({
      status: 'success',
    });

    response.code(200);
    return response;
  }
}

module.exports = LikesHandler;
