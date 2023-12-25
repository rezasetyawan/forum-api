/* eslint-disable require-jsdoc */
class GetThreadDetailUseCase {
  constructor({
    threadRepository,
    commentRepository,
    commentReplyRepository,
    commentLikeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._commentReplyRepository = commentReplyRepository;
    this._commentLikeRepository = commentLikeRepository;
  }

  async execute(useCasePayload) {
    const {threadId} = useCasePayload;

    await this._threadRepository.isThreadExist(threadId);
    const thread = await this._threadRepository.getThreadDetailById(threadId);
    const threadComments = await this._commentRepository.getCommentsByThreadId(
        threadId,
    );

    const threadCommentReplies =
      await this._commentReplyRepository.getCommentRepliesByThreadId(threadId);

    const commentLikes =
      await this._commentLikeRepository.getCommentsLikeCountsByThreadId(
          threadId,
      );

    function getFilteredAndTransformedReplies(replies, commentId) {
      const filteredReplies = replies.filter(
          (reply) => reply.comment_id === commentId,
      );
      const transformedReplies = filteredReplies.map((reply) => {
        return {
          id: reply.id,
          content: reply.is_delete ?
            '**balasan telah dihapus**' :
            reply.content,
          date: reply.date,
          username: reply.username,
        };
      });

      return transformedReplies;
    }

    const transformedThreadComments = threadComments.map((comment) => {
      return {
        id: comment.id,
        username: comment.username,
        date: comment.date,
        replies: getFilteredAndTransformedReplies(
            threadCommentReplies,
            comment.id,
        ),
        content: comment.is_delete ?
          '**komentar telah dihapus**' :
          comment.content,
      };
    });

    const transformedThreadCommentsWithLikeCount =
      transformedThreadComments.map((comment) => {
        return {
          ...comment,
          likeCount: commentLikes.filter(
              (like) => like.comment_id === comment.id,
          )[0].likes,
        };
      });

    return {...thread, comments: transformedThreadCommentsWithLikeCount};
  }
}

module.exports = GetThreadDetailUseCase;
