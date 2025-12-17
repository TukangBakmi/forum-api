const LikeCommentUseCase = require('../../../../Applications/use_case/LikeCommentUseCase');

class CommentLikesHandler {
  constructor(container) {
    this._container = container;

    this.putCommentLikeHandler = this.putCommentLikeHandler.bind(this);
  }

  async putCommentLikeHandler(request, h) {
    const likeCommentUseCase = this._container.getInstance(LikeCommentUseCase.name);
    const { threadId, commentId } = request.params;
    const { id: owner } = request.auth.credentials;

    await likeCommentUseCase.execute({
      threadId,
      commentId,
      owner,
    });

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = CommentLikesHandler;