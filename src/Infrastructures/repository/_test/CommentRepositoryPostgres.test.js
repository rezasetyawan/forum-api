const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({username: 'Reza'});
    await ThreadsTableTestHelper.addThread({
      id: 'thread-123',
      owner: 'user-123',
    });
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist new comment and return added comment correctly', async () => {
      // Arrange
      const newComment = new AddComment({
        content: 'test comment',
        owner: 'user-123',
        threadId: 'thread-123',
      });

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool,
          fakeIdGenerator,
      );

      // Action & Assert
      const addedComment = await commentRepositoryPostgres.addComment(
          newComment,
      );

      expect(addedComment).toStrictEqual(
          new AddedComment({
            id: 'comment-123',
            content: 'test comment',
            owner: 'user-123',
          }),
      );
      await expect(
          commentRepositoryPostgres.isCommentExist('comment-123', 'thread-123'),
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('isCommentExist function', () => {
    it('should throw NotFoundError when comment and thread not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool,
          () => {},
      );

      // Action and Assert
      await expect(
          commentRepositoryPostgres.isCommentExist('comment-123', 'thread-123'),
      ).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when comment and thread found', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool,
          () => {},
      );

      // Action and Assert
      await expect(
          commentRepositoryPostgres.isCommentExist('comment-123', 'thread-123'),
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should throw AuthorizationError when comment have invalid owner', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool,
          () => {},
      );

      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      });

      // Action and Assert
      await expect(
          commentRepositoryPostgres.verifyCommentOwner(
              'comment-123',
              'invalid-user',
          ),
      ).rejects.toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when comment have valid owner', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool,
          () => {},
      );

      // Action and Assert
      await expect(
          commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123'),
      ).resolves.not.toThrowError(AuthorizationError);
    });

    it('should throw NotFoundError if comment not found when valid owner try to access it', async () => {
      // Arange
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool,
          () => {},
      );

      // Action and Assert
      await expect(
          commentRepositoryPostgres.verifyCommentOwner(
              'comment-12389',
              'user-123',
          ),
      ).rejects.toThrowError(NotFoundError);
    });
  });

  describe('deleteCommentById function', () => {
    it('should throw NotFoundError if the desired comment that wanted to delete is not found', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        owner: 'user-123',
        threadId: 'thread-123',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool,
          () => {},
      );

      // Action & Assert
      await expect(
          commentRepositoryPostgres.deleteCommentById('comment-123908'),
      ).rejects.toThrowError(NotFoundError);

      const comment = await CommentsTableTestHelper.findCommentById(
          'comment-123',
      );
      expect(comment.is_delete).toStrictEqual(false);
    });

    it('should delete comment by comment id correctly', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        owner: 'user-123',
        threadId: 'thread-123',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool,
          () => {},
      );

      // Action
      await commentRepositoryPostgres.deleteCommentById('comment-123');

      // Assert
      const comments = await CommentsTableTestHelper.findUndeletedCommentById(
          'comment-123',
      );
      const comment = await CommentsTableTestHelper.findCommentById(
          'comment-123',
      );

      expect(comments).toHaveLength(0);
      expect(comment.is_delete).toStrictEqual(true);
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('should return empty array when not found comment in thread', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool,
          () => {},
      );

      // Action
      const comments = await commentRepositoryPostgres.getCommentsByThreadId(
          'thread-123',
      );

      const undeletedComments =
        await CommentsTableTestHelper.findUndeletedCommentById('comment-123');

      // Assert
      expect(comments).toHaveLength(0);
      expect(undeletedComments).toHaveLength(0);
    });

    it('should return all comment by thread id correctly', async () => {
      // Arrange
      const comment1 = {
        id: 'comment-123',
        owner: 'user-123',
        threadId: 'thread-123',
        content: 'Comment content test',
        date: '2023-12-20T06:15:03.896Z',
      };

      const comment2 = {
        id: 'comment-124',
        owner: 'user-123',
        threadId: 'thread-123',
        content: 'Comment content test',
        date: '2023-12-20T06:54:44.813Z',
      };
      await CommentsTableTestHelper.addComment(comment1);
      await CommentsTableTestHelper.addComment(comment2);

      const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool,
          () => {},
      );

      // Action
      const comments = await commentRepositoryPostgres.getCommentsByThreadId(
          'thread-123',
      );

      // Assert
      expect(comments).toEqual([
        {
          id: comment1.id,
          username: 'Reza',
          date: comment1.date,
          content: comment1.content,
          is_delete: false,
        },
        {
          id: comment2.id,
          username: 'Reza',
          date: comment2.date,
          content: comment2.content,
          is_delete: false,
        },
      ]);
      expect(comments[0].id).toBeDefined();
      expect(comments[0].username).toBeDefined();
      expect(comments[0].date).toBeDefined();
      expect(comments[0].content).toBeDefined();
      expect(comments[0].is_delete).toBeDefined();
      expect(comments).toHaveLength(2);
    });
  });
});
