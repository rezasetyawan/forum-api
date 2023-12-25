/* eslint-disable require-jsdoc */
const CommentLikeRepository = require('../../../Domains/comment_likes/CommentLikeRepository');
const CommentReplyRepository = require('../../../Domains/comment_replies/CommentReplyRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');

describe('GetThreadDetailUseCase', () => {
  it('should orchestrating the get thread action correctly', async () => {
    // Arange
    const useCasePayload = {threadId: 'thread-123'};

    const thread = {
      id: 'thread-123',
      title: 'test thread',
      body: 'test thread',
      date: '2023-12-20T06:14:56.045Z',
      username: 'Reza',
    };

    const comments = [
      {
        id: 'comment-123',
        username: 'AsepWijaya',
        date: '2023-12-20T06:15:03.896Z',
        content: 'test comment',
        is_delete: false,
      },
      {
        id: 'comment-124',
        username: 'Lukman',
        date: '2023-12-20T06:54:44.813Z',
        content: 'test comment',
        is_delete: true,
      },
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockCommentReplyRepository = new CommentReplyRepository();
    const mockCommentLikeRepository = new CommentLikeRepository();

    mockThreadRepository.isThreadExist = jest
        .fn()
        .mockImplementation(() => Promise.resolve());

    mockThreadRepository.getThreadDetailById = jest
        .fn()
        .mockImplementation(() =>
          Promise.resolve({
            id: 'thread-123',
            title: 'test thread',
            body: 'test thread',
            date: '2023-12-20T06:14:56.045Z',
            username: 'Reza',
          }),
        );

    mockCommentRepository.getCommentsByThreadId = jest
        .fn()
        .mockImplementation(() =>
          Promise.resolve([
            {
              id: 'comment-123',
              username: 'AsepWijaya',
              date: '2023-12-20T06:15:03.896Z',
              content: 'test comment',
              is_delete: false,
            },
            {
              id: 'comment-124',
              username: 'Lukman',
              date: '2023-12-20T06:54:44.813Z',
              content: 'test comment',
              is_delete: true,
            },
          ]),
        );

    mockCommentReplyRepository.getCommentRepliesByThreadId = jest
        .fn()
        .mockImplementation(() =>
          Promise.resolve([
            {
              id: 'reply-123',
              username: 'Reza',
              date: '2023-12-20T13:12:18.114Z',
              content: 'test comment reply',
              is_delete: true,
              comment_id: 'comment-123',
            },
            {
              id: 'reply-124',
              username: 'Reza',
              date: '2023-12-20T15:13:06.268Z',
              content: 'test comment reply 2',
              is_delete: false,
              comment_id: 'comment-123',
            },
          ]),
        );

    mockCommentLikeRepository.getCommentsLikeCountsByThreadId = jest.fn(() =>
      Promise.resolve([
        {
          comment_id: 'comment-123',
          likes: 4,
        },
        {
          comment_id: 'comment-124',
          likes: 2,
        },
      ]),
    );

    const threadCommentReplies =
      await mockCommentReplyRepository.getCommentRepliesByThreadId(
          'thread-123',
      );

    const commentLikes =
      await mockCommentLikeRepository.getCommentsLikeCountsByThreadId('thread-123');

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

    const expectedCommentResult = comments.map((comment) => {
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
        likeCount: commentLikes.filter(
            (like) => like.comment_id === comment.id,
        )[0].likes,
      };
    });

    const getDetailThreadUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      commentReplyRepository: mockCommentReplyRepository,
      commentLikeRepository: mockCommentLikeRepository,
    });

    const threadDetail = await getDetailThreadUseCase.execute(useCasePayload);

    expect(threadDetail).toEqual({
      ...thread,
      comments: expectedCommentResult,
    });

    expect(threadDetail.comments[0].replies).toHaveLength(2);
    expect(threadDetail.comments[0].likeCount).toStrictEqual(4);
    expect(threadDetail.comments[1].likeCount).toStrictEqual(2);

    expect(mockThreadRepository.getThreadDetailById).toBeCalledWith(
        useCasePayload.threadId,
    );
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(
        useCasePayload.threadId,
    );
    expect(
        mockCommentReplyRepository.getCommentRepliesByThreadId,
    ).toBeCalledWith(useCasePayload.threadId);

    expect(mockThreadRepository.getThreadDetailById).toBeCalledTimes(1);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledTimes(1);

    // expect to called two times because one for the use case and another one just for testing
    expect(
        mockCommentReplyRepository.getCommentRepliesByThreadId,
    ).toBeCalledTimes(2);

    expect(mockCommentLikeRepository.getCommentsLikeCountsByThreadId).toBeCalledWith(
        useCasePayload.threadId,
    );
    // expect to called two times because one for the use case and another one just for testing
    expect(
        mockCommentLikeRepository.getCommentsLikeCountsByThreadId,
    ).toBeCalledTimes(2);
  });
});
