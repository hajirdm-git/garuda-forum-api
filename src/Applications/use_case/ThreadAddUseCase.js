const ThreadAdd = require('../../Domains/threads/entities/ThreadAdd');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const addThread = new ThreadAdd(useCasePayload);
    const result = await this._threadRepository.addThread(addThread);
    return result;
  }
}

module.exports = AddThreadUseCase;
