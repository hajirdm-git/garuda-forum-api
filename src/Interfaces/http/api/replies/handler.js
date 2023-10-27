const ReplyCommentAddUseCase = require('../../../../Applications/use_case/ReplyCommentAddUseCase');
const DeleteReplyCommetUseCase = require('../../../../Applications/use_case/ReplyCommentDeleteUseCase');

class RepliesHandler {
  constructor(container) {
    this._container = container;

    this.postReplyCommentHandler = this.postReplyCommentHandler.bind(this);
    this.postDeleteReplyCommentHandler = this.postDeleteReplyCommentHandler.bind(this);
  }

  async postReplyCommentHandler(request, h) {
    const replyCommentAddUseCase = this._container.getInstance(ReplyCommentAddUseCase.name);
    const { id: owner } = request.auth.credentials;
    const { content } = request.payload;
    const { threadId, commentId } = request.params;

    const {
      id: replyId, content: replyContent, owner: replyOwner,
    } = await replyCommentAddUseCase.execute({
      threadId, commentId, content, owner,
    });

    const response = h.response({
      status: 'success',
      data: {
        addedReply: {
          id: replyId,
          content: replyContent,
          owner: replyOwner,
        },
      },
    });

    response.code(201);
    return response;
  }

  async postDeleteReplyCommentHandler(request, h) {
    const deleteReplyCommetUseCase = this._container.getInstance(DeleteReplyCommetUseCase.name);
    const { id: owner } = request.auth.credentials;
    const { threadId, commentId, replyId } = request.params;

    await deleteReplyCommetUseCase.execute({
      threadId, commentId, replyId, owner,
    });

    const response = h.response({
      status: 'success',
    });

    response.code(200);
    return response;
  }
}

module.exports = RepliesHandler;
