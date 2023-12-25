const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const pool = require('../../database/postgres/pool');
const AddCommentReply = require('../../../Domains/comment_replies/entities/AddCommentReply');
const CommentRepliesTableTestHelper = require('../../../../tests/CommentRepliesTableTestHelper');
const AddedCommentReply = require('../../../Domains/comment_replies/entities/AddedCommentReply');
const CommentReplyRepositoryPostgres = require('../CommentReplyRepositoryPostgres');

describe('CommenReplytRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({username: 'Reza'});
    await ThreadsTableTestHelper.addThread({
      id: 'thread-123',
      owner: 'user-123',
    });
    await CommentsTableTestHelper.addComment({});
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentRepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addCommentReply function', () => {
    it('should persist new comment reply and return added comment reply correctly', async () => {
      // Arrange

      const newCommentReply = new AddCommentReply({
        content: 'test comment',
        owner: 'user-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
      });

      const fakeIdGenerator = () => '123';
      const commentReplyRepositoryPostgres = new CommentReplyRepositoryPostgres(
          pool,
          fakeIdGenerator,
      );

      // Action
      const addedCommentReply =
        await commentReplyRepositoryPostgres.addCommentReply(newCommentReply);

      // Assert
      expect(addedCommentReply).toStrictEqual(
          new AddedCommentReply({
            id: 'reply-123',
            content: 'test comment',
            owner: 'user-123',
          }),
      );
      await expect(
          commentReplyRepositoryPostgres.isCommentReplyExist(
              'reply-123',
              'thread-123',
          ),
      ).resolves.not.toThrowError(NotFoundError);
    });

    it('should return added comment reply correctly', async () => {
      // Arrange

      const newCommentReply = new AddCommentReply({
        content: 'test comment',
        owner: 'user-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
      });

      const fakeIdGenerator = () => '123';
      const commentReplyRepositoryPostgres = new CommentReplyRepositoryPostgres(
          pool,
          fakeIdGenerator,
      );

      // Action
      const addedComment = await commentReplyRepositoryPostgres.addCommentReply(
          newCommentReply,
      );

      // Assert
      expect(addedComment).toStrictEqual(
          new AddedCommentReply({
            content: 'test comment',
            owner: 'user-123',
            id: 'reply-123',
          }),
      );
    });
  });

  describe('isCommentReplyExist function', () => {
    it('should throw NotFoundError when comment reply and thread not found', async () => {
      // Arrange
      const commentReplyRepositoryPostgres = new CommentReplyRepositoryPostgres(
          pool,
          () => {},
      );

      // Action and Assert
      await expect(
          commentReplyRepositoryPostgres.isCommentReplyExist(
              'reply-123',
              'thread-123',
          ),
      ).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when comment reply and thread found', async () => {
      // Arrange
      await CommentRepliesTableTestHelper.addCommentReply({
        id: 'reply-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
      });

      const commentReplyRepositoryPostgres = new CommentReplyRepositoryPostgres(
          pool,
          () => {},
      );

      // Action and Assert
      await expect(
          commentReplyRepositoryPostgres.isCommentReplyExist(
              'reply-123',
              'thread-123',
          ),
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyCommentReplyOwner function', () => {
    it('should thorw NotFoundError if comment reply that owner want to access is not found', async () => {
      // Arrange

      const commentReplyRepositoryPostgres = new CommentReplyRepositoryPostgres(
          pool,
          () => {},
      );

      await CommentRepliesTableTestHelper.addCommentReply({
        id: 'reply-123',
        threadId: 'thread-123',
        owner: 'user-123',
        commentId: 'comment-123',
      });

      // Action and Assert
      await expect(
          commentReplyRepositoryPostgres.verifyCommentReplyOwner(
              'reply-12308080',
              'user-123',
          ),
      ).rejects.toThrowError(NotFoundError);
    });

    it('should throw AuthorizationError when comment reply have invalid owner', async () => {
      // Arrange
      const commentReplyRepositoryPostgres = new CommentReplyRepositoryPostgres(
          pool,
          () => {},
      );

      await CommentRepliesTableTestHelper.addCommentReply({
        id: 'reply-123',
        threadId: 'thread-123',
        owner: 'user-123',
        commentId: 'comment-123',
      });

      // Action and Assert
      await expect(
          commentReplyRepositoryPostgres.verifyCommentReplyOwner(
              'reply-123',
              'invalid-user',
          ),
      ).rejects.toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when comment reply have valid owner', async () => {
      // Arrange

      await CommentRepliesTableTestHelper.addCommentReply({
        id: 'reply-123',
        threadId: 'thread-123',
        owner: 'user-123',
        commentId: 'comment-123',
      });

      const commentReplyRepositoryPostgres = new CommentReplyRepositoryPostgres(
          pool,
          () => {},
      );

      // Action and Assert
      await expect(
          commentReplyRepositoryPostgres.verifyCommentReplyOwner(
              'reply-123',
              'user-123',
          ),
      ).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('deleteCommentReplyById function', () => {
    it('should throw NotFoundError if comment reply that owner want to delete is not found', async () => {
      // Arrange
      await CommentRepliesTableTestHelper.addCommentReply({
        id: 'reply-123',
        threadId: 'thread-123',
        owner: 'user-123',
        commentId: 'comment-123',
      });

      const commentReplyRepositoryPostgres = new CommentReplyRepositoryPostgres(
          pool,
          () => {},
      );

      // Action & Assert
      await expect(
          commentReplyRepositoryPostgres.deleteCommentReplyById('reply-123ldlkdf'),
      ).rejects.toThrowError(NotFoundError);

      const commentReply =
        await CommentRepliesTableTestHelper.findCommentReplyById('reply-123');

      expect(commentReply.is_delete).toStrictEqual(false);
    });

    it('should delete comment reply by comment reply id correctly', async () => {
      // Arrange
      await CommentRepliesTableTestHelper.addCommentReply({
        id: 'reply-123',
        threadId: 'thread-123',
        owner: 'user-123',
        commentId: 'comment-123',
      });

      const commentReplyRepositoryPostgres = new CommentReplyRepositoryPostgres(
          pool,
          () => {},
      );

      // Action
      await commentReplyRepositoryPostgres.deleteCommentReplyById('reply-123');

      // Assert
      const commentReplies =
        await CommentsTableTestHelper.findUndeletedCommentById('reply-123');
      const commentReply =
        await CommentRepliesTableTestHelper.findCommentReplyById('reply-123');

      expect(commentReplies).toHaveLength(0);
      expect(commentReply.is_delete).toStrictEqual(true);
    });
  });

  describe('getCommentRepliesByThreadId function', () => {
    it('should return empty array when not found comment replies in thread', async () => {
      // Arrange

      const commentReplyRepositoryPostgres = new CommentReplyRepositoryPostgres(
          pool,
          () => {},
      );

      // Action
      const commentReplies =
        await commentReplyRepositoryPostgres.getCommentRepliesByThreadId(
            'thread-123',
        );

      const undeletedCommentReplies =
        await CommentRepliesTableTestHelper.findUndeletedCommentReplyById(
            'reply-123',
        );

      // Assert
      expect(commentReplies).toHaveLength(0);
      expect(undeletedCommentReplies).toHaveLength(0);
    });

    it('should return all comment replies by thread id correctly', async () => {
      // Arrange

      const commentReply1 = {
        id: 'reply-123',
        owner: 'user-123',
        threadId: 'thread-123',
        content: 'Comment content test',
        date: '2023-12-20T06:15:03.896Z',
        commentId: 'comment-123',
      };

      const commentReply2 = {
        id: 'reply-124',
        owner: 'user-123',
        threadId: 'thread-123',
        content: 'Comment content test',
        date: '2023-12-20T06:54:44.813Z',
        commentId: 'comment-123',
      };
      await CommentRepliesTableTestHelper.addCommentReply(commentReply1);
      await CommentRepliesTableTestHelper.addCommentReply(commentReply2);

      const commentReplyRepositoryPostgres = new CommentReplyRepositoryPostgres(
          pool,
          () => {},
      );

      // Action
      const commentReplies =
        await commentReplyRepositoryPostgres.getCommentRepliesByThreadId(
            'thread-123',
        );

      // Assert
      expect(commentReplies).toEqual([
        {
          id: commentReply1.id,
          username: 'Reza',
          date: commentReply1.date,
          content: commentReply1.content,
          is_delete: false,
          comment_id: 'comment-123',
        },
        {
          id: commentReply2.id,
          username: 'Reza',
          date: commentReply2.date,
          content: commentReply2.content,
          is_delete: false,
          comment_id: 'comment-123',
        },
      ]);
      expect(commentReplies[0].id).toBeDefined();
      expect(commentReplies[0].username).toBeDefined();
      expect(commentReplies[0].date).toBeDefined();
      expect(commentReplies[0].content).toBeDefined();
      expect(commentReplies[0].is_delete).toBeDefined();
      expect(commentReplies).toHaveLength(2);
    });
  });
});
