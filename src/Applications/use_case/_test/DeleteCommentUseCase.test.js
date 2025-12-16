const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    const useCaseParams = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const mockCommentRepository = new CommentRepository();

    mockCommentRepository.verifyCommentExists = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    await deleteCommentUseCase.execute(useCaseParams);

    expect(mockCommentRepository.verifyCommentExists).toBeCalledWith(useCaseParams.commentId);
    expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(useCaseParams.commentId, useCaseParams.owner);
    expect(mockCommentRepository.deleteComment).toBeCalledWith(useCaseParams.commentId);
  });
});
