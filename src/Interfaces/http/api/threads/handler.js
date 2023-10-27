const ThreadAddUseCase = require('../../../../Applications/use_case/ThreadAddUseCase');
const ThreadDetailUseCase = require('../../../../Applications/use_case/ThreadDetailUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadDetailHandler = this.getThreadDetailHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const threadAddUseCase = this._container.getInstance(ThreadAddUseCase.name);
    const { id: owner } = request.auth.credentials;
    const { title, body } = request.payload;

    const {
      id: threadId, title: threadTitle, owner: threadOwner,
    } = await threadAddUseCase.execute({ title, body, owner });

    const response = h.response({
      status: 'success',
      data: {
        addedThread: {
          id: threadId,
          title: threadTitle,
          owner: threadOwner,
        },
      },
    });
    response.code(201);
    return response;
  }

  async getThreadDetailHandler(request, h) {
    const threadDetailUseCase = this._container.getInstance(ThreadDetailUseCase.name);
    const { threadId } = request.params;

    const {
      id, title, body, date, username, comments,
    } = await threadDetailUseCase.execute({ threadId });

    const response = h.response({
      status: 'success',
      data: {
        thread: {
          id, title, body, date, username, comments,
        },
      },
    });
    response.code(200);
    return response;
  }
}

module.exports = ThreadsHandler;
