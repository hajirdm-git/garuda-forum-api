const CommentAddUseCase = require('../../../../Applications/use_case/CommentAddUseCase');
const CommentDeleteUseCase = require('../../../../Applications/use_case/CommentDeleteUseCase');

class CommnetHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const commentAddUseCase = this._container.getInstance(CommentAddUseCase.name);
    const { id: owner } = request.auth.credentials;
    const { content } = request.payload;
    const { threadId } = request.params;

    const {
      id: commentId, content: commentContent, owner: commentOwner,
    } = await commentAddUseCase.execute({ threadId, content, owner });

    const response = h.response({
      status: 'success',
      data: {
        addedComment: {
          id: commentId,
          content: commentContent,
          owner: commentOwner,
        },
      },
    });

    response.code(201);
    return response;
  }

  async deleteCommentHandler(request, h) {
    const commentDeleteUseCase = this._container.getInstance(CommentDeleteUseCase.name);
    const { id: owner } = request.auth.credentials;
    const { threadId, commentId } = request.params;

    const x = await commentDeleteUseCase.execute({ threadId, commentId, owner });

    const response = h.response({
      status: 'success',
    });

    response.code(200);
    return response;
  }
}

module.exports = CommnetHandler;
