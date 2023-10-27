const ThreadDetailUseCase = require('../ThreadDetailUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const LikeCommentRepository = require('../../../Domains/likes/LikeRepository');

describe('DetailThreadUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    // arrange
    const useCasePayload = {
      threadId: 'thread-123',
    };

    const getThreadByIdResponseExpected = {
      id: 'thread-h_2FkLZhtgBKY2kh4CC02',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
    };

    const getCommentsByThreadIdResponseExpected = [
      {
        id: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'johndoe',
        date: '2021-08-08T07:22:33.555Z',
        content: 'sebuah comment',
        isDelete: false,
      },
      {
        id: 'comment-yksuCoxM2s4MMrZJO-qVD',
        username: 'dicoding',
        date: '2021-08-08T07:26:21.338Z',
        content: 'comment akan di hapus',
        isDelete: true,
      },
    ];

    const repliesResponse = [
      {
        id: 'reply-123',
        username: 'dicoding',
        content: 'reply content',
        date: '2021-08-08T07:22:33.555Z',
        isDelete: false,
        commentId: 'comment-yksuCoxM2s4MMrZJO-qVD',
      },
      {
        id: 'reply-456',
        username: 'newdicoding',
        content: 'reply content 2',
        date: '2021-08-08T07:22:33.555Z',
        isDelete: true,
        commentId: 'comment-yksuCoxM2s4MMrZJO-qVD',
      },
    ];

    const getLikeCountByCommentIds = [
      {
        likeCount: '2',
        commentId: 'comment-_pby2_tmXV6bcvcdev8xk',
      },
      {
        likeCount: '5',
        commentId: 'comment-yksuCoxM2s4MMrZJO-qVD',
      },
    ];

    const expectedResponse = {
      id: 'thread-h_2FkLZhtgBKY2kh4CC02',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
      comments: [
        {
          id: 'comment-_pby2_tmXV6bcvcdev8xk',
          username: 'johndoe',
          content: 'sebuah comment',
          date: '2021-08-08T07:22:33.555Z',
          replies: [],
          likeCount: 2,
        },
        {
          id: 'comment-yksuCoxM2s4MMrZJO-qVD',
          username: 'dicoding',
          content: '**komentar telah dihapus**',
          date: '2021-08-08T07:26:21.338Z',
          replies: [
            {
              id: 'reply-123',
              username: 'dicoding',
              content: 'reply content',
              date: '2021-08-08T07:22:33.555Z',
            },
            {
              id: 'reply-456',
              username: 'newdicoding',
              content: '**balasan telah dihapus**',
              date: '2021-08-08T07:22:33.555Z',
            },
          ],
          likeCount: 5,
        },
      ],
    };

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockLikeCommentRepository = new LikeCommentRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadExist = jest.fn(() => Promise.resolve());
    mockCommentRepository.getCommentsByThreadId = jest
      .fn(() => Promise.resolve(getCommentsByThreadIdResponseExpected));

    mockThreadRepository.getDetailThreadById = jest
      .fn(() => Promise.resolve(getThreadByIdResponseExpected));

    mockReplyRepository.getRepliesByCommentIds = jest.fn(() => Promise.resolve(repliesResponse));

    mockLikeCommentRepository.getLikeCountByCommentIds = jest
      .fn(() => Promise.resolve(getLikeCountByCommentIds));

    /** creating use case instance */
    const getDetailThreadUseCase = new ThreadDetailUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      replyRepository: mockReplyRepository,
      likeCommentRepository: mockLikeCommentRepository,
    });

    // Action
    const result = await getDetailThreadUseCase.execute(useCasePayload);

    // Assert
    expect(result).toStrictEqual(expectedResponse);

    expect(mockThreadRepository.verifyThreadExist).toBeCalledWith(useCasePayload.threadId);
    expect(mockThreadRepository.getDetailThreadById).toBeCalledWith(useCasePayload.threadId);
  });
});
