const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');

describe('GetThreadDetailUseCase', () => {
  it('should orchestrating the get thread detail action correctly', async () => {
    const useCaseParams = { threadId: 'thread-123' };

    const expectedThread = {
      id: 'thread-123',
      title: 'a thread',
      body: 'a thread body',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
    };

    const expectedComments = [
      {
        id: 'comment-123',
        username: 'johndoe',
        date: '2021-08-08T07:22:33.555Z',
        content: 'a comment',
        is_delete: false,
        like_count: 0,
      },
      {
        id: 'comment-124',
        username: 'dicoding',
        date: '2021-08-08T07:26:21.338Z',
        content: 'deleted comment',
        is_delete: true,
        like_count: 0,
      },
    ];

    const expectedReplies = [
      {
        id: 'reply-123',
        username: 'johndoe',
        date: '2021-08-08T07:59:48.766Z',
        content: 'a reply',
        is_delete: false,
      },
      {
        id: 'reply-124',
        username: 'dicoding',
        date: '2021-08-08T08:07:01.522Z',
        content: 'deleted reply',
        is_delete: true,
      },
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedThread));
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedComments));
    mockReplyRepository.getRepliesByCommentId = jest.fn()
      .mockImplementation((commentId) => {
        if (commentId === 'comment-123') {
          return Promise.resolve(expectedReplies);
        }
        return Promise.resolve([]);
      });

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    const threadDetail = await getThreadDetailUseCase.execute(useCaseParams);

    expect(threadDetail).toEqual({
      id: 'thread-123',
      title: 'a thread',
      body: 'a thread body',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
      comments: [
        {
          id: 'comment-123',
          username: 'johndoe',
          date: '2021-08-08T07:22:33.555Z',
          content: 'a comment',
          likeCount: 0,
          replies: [
            {
              id: 'reply-123',
              content: 'a reply',
              date: '2021-08-08T07:59:48.766Z',
              username: 'johndoe',
            },
            {
              id: 'reply-124',
              content: '**balasan telah dihapus**',
              date: '2021-08-08T08:07:01.522Z',
              username: 'dicoding',
            },
          ],
        },
        {
          id: 'comment-124',
          username: 'dicoding',
          date: '2021-08-08T07:26:21.338Z',
          content: '**komentar telah dihapus**',
          likeCount: 0,
          replies: [],
        },
      ],
    });
    expect(mockThreadRepository.getThreadById).toBeCalledWith('thread-123');
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith('thread-123');
    expect(mockReplyRepository.getRepliesByCommentId).toHaveBeenCalledTimes(2);
    expect(mockReplyRepository.getRepliesByCommentId).toBeCalledWith('comment-123');
    expect(mockReplyRepository.getRepliesByCommentId).toBeCalledWith('comment-124');
  });
});
