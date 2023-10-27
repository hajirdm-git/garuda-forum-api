const ThreadDetail = require('../../Domains/threads/entities/ThreadDetail');
const RepliesMarkedDelete = require('../../Domains/replies/entities/RepliesMarkedDelete');

class ThreadDetailUseCase {
  constructor({
    commentRepository, threadRepository, replyRepository, likeCommentRepository,
  }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._replyRepository = replyRepository;
    this._likeCommentRepository = likeCommentRepository;
  }

  async execute(useCasePayload) {
    const { threadId } = new ThreadDetail(useCasePayload);
    await this._threadRepository.verifyThreadExist(threadId);

    const {
      id, title, body, date, username,
    } = await this._threadRepository.getDetailThreadById(threadId);

    const commentsResult = await this._commentRepository.getCommentsByThreadId(threadId);
    const commentIds = commentsResult.map((comment) => comment.id);

    const replies = await this._replyRepository.getRepliesByCommentIds(commentIds);

    const likes = await this._likeCommentRepository.getLikeCountByCommentIds(commentIds);

    const commentReply = [];
    commentsResult.forEach((comment) => {
      const dataReply = replies.filter((reply) => comment.id === reply.commentId);
      const likeCount = likes.filter((cm) => comment.id === cm.commentId);
      const count = (likeCount.length === 0) ? 0 : likeCount[0].likeCount;
      const repliesMarkDeleted = new RepliesMarkedDelete(dataReply).returnMarked();

      commentReply.push({
        id: comment.id,
        username: comment.username,
        date: comment.date,
        content: (comment.isDelete) ? '**komentar telah dihapus**' : comment.content,
        replies: repliesMarkDeleted,
        likeCount: parseInt(count, 10),
      });
    });

    return {
      id, title, body, date, username, comments: commentReply,
    };
  }
}

module.exports = ThreadDetailUseCase;
