const ThreadDetail = require('../../Domains/threads/entities/ThreadDetail');
const CommentDetail = require('../../Domains/comments/entities/CommentDetail');
const DetailReply = require('../../Domains/replies/entities/DetailReply');

class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCaseParams) {
    const { threadId } = useCaseParams;
    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(threadId);

    const mappedComments = await Promise.all(comments.map(async (comment) => {
      const replies = await this._replyRepository.getRepliesByCommentId(comment.id);
      const mappedReplies = replies.map((reply) => new DetailReply({
        id: reply.id,
        content: reply.content,
        date: reply.date,
        username: reply.username,
        isDelete: reply.is_delete,
      }));

      return new CommentDetail({
        id: comment.id,
        username: comment.username,
        date: comment.date,
        content: comment.content,
        isDelete: comment.is_delete,
        likeCount: parseInt(comment.like_count, 10),
        replies: mappedReplies,
      });
    }));

    return new ThreadDetail({
      ...thread,
      comments: mappedComments,
    });
  }
}

module.exports = GetThreadDetailUseCase;
