const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const CommentLikeRepository = require('../../../Domains/comment_likes/CommentLikeRepository');
const LikeCommentUseCase = require('../LikeCommentUseCase');

describe('LikeCommentUseCase', () => {
  it('should orchestrating the like comment action correctly', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockCommentLikeRepository = new CommentLikeRepository();

    mockThreadRepository.verifyThreadExists = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentExists = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentLikeRepository.verifyLikeExists = jest.fn()
      .mockImplementation(() => Promise.resolve(false));
    mockCommentLikeRepository.addLike = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      commentLikeRepository: mockCommentLikeRepository,
    });

    await likeCommentUseCase.execute(useCasePayload);

    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith('thread-123');
    expect(mockCommentRepository.verifyCommentExists).toBeCalledWith('comment-123');
    expect(mockCommentLikeRepository.verifyLikeExists).toBeCalledWith('comment-123', 'user-123');
    expect(mockCommentLikeRepository.addLike).toBeCalledWith('comment-123', 'user-123');
  });

  it('should orchestrating the unlike comment action correctly', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockCommentLikeRepository = new CommentLikeRepository();

    mockThreadRepository.verifyThreadExists = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentExists = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentLikeRepository.verifyLikeExists = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockCommentLikeRepository.deleteLike = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      commentLikeRepository: mockCommentLikeRepository,
    });

    await likeCommentUseCase.execute(useCasePayload);

    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith('thread-123');
    expect(mockCommentRepository.verifyCommentExists).toBeCalledWith('comment-123');
    expect(mockCommentLikeRepository.verifyLikeExists).toBeCalledWith('comment-123', 'user-123');
    expect(mockCommentLikeRepository.deleteLike).toBeCalledWith('comment-123', 'user-123');
  });
});