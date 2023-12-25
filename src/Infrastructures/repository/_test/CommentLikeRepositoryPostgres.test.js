const CommentLikesTableTestHelper = require("../../../../tests/CommentLikesTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const pool = require("../../database/postgres/pool");
const CommentLikeRepositoryPostgres = require("../CommentLikeRepositoryPostgres");

describe("CommentLikeRepositoryPostgres", () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({});
    await ThreadsTableTestHelper.addThread({});
    await CommentsTableTestHelper.addComment({});
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await CommentLikesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("likeComment function", () => {
    it("should add like comment correctly", async () => {
      // Arrange
      const fakeIdGenerator = () => "123";

      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await commentLikeRepositoryPostgres.likeComment(
        "comment-123",
        "user-123"
      );

      // Assert
      const likes = await CommentLikesTableTestHelper.getCommentLike(
        "comment-123",
        "user-123"
      );
      expect(likes).toHaveLength(1);
    });
  });

  describe("unlikeComment function", () => {
    it("should unlike comment correctly", async () => {
      // Arrange
      await CommentLikesTableTestHelper.addCommentLike({});

      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(
        pool,
        () => {}
      );

      // Action
      await commentLikeRepositoryPostgres.unlikeComment(
        "comment-123",
        "user-123"
      );

      // Assert
      const likes = await CommentLikesTableTestHelper.getCommentLike(
        "comment-123",
        "user-123"
      );
      expect(likes).toHaveLength(0);
    });
  });

  describe("isCommentLiked function", () => {
    it("should return rowCount correctly when like is available", async () => {
      // Arrange
      await CommentLikesTableTestHelper.addCommentLike({});

      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(
        pool,
        () => {}
      );

      // Action
      const isCommentLiked = await commentLikeRepositoryPostgres.isCommentLiked(
        "comment-123",
        "user-123"
      );

      // Assert
      expect(isCommentLiked).toEqual(true);
    });

    it("should return rowCount correctly when like not available", async () => {
      // Arrange
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(
        pool,
        () => {}
      );

      // Action
      const isCommentLiked = await commentLikeRepositoryPostgres.isCommentLiked(
        "comment-123",
        "user-123"
      );

      // Assert
      expect(isCommentLiked).toEqual(false);
    });
  });

  describe("getCommentLikesCountByThreadId function", () => {
    it("should return an empty array when thread has no comment", async () => {
      // Arange
      await CommentsTableTestHelper.cleanTable();
      await CommentLikesTableTestHelper.cleanTable();
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(
        pool,
        {}
      );

      // Action
      const result =
        await commentLikeRepositoryPostgres.getCommentsLikeCountsByThreadId(
          "thread-123"
        );

      // Asert
      expect(result).toStrictEqual([]);
    });

    it("should return all the comments likes", async () => {
      // Arange
      await CommentLikesTableTestHelper.addCommentLike({});

      const expectedResult = [
        {
          likes: 1,
          comment_id: "comment-123",
        },
      ];

      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(
        pool,
        {}
      );

      // Action
      const result =
        await commentLikeRepositoryPostgres.getCommentsLikeCountsByThreadId(
          "thread-123"
        );

      // Asert
      expect(result).toStrictEqual(expectedResult);
    });

    it("should return all the comments with no like", async () => {
      // Arange
      const expectedResult = [
        {
          likes: 0,
          comment_id: "comment-123",
        },
      ];

      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(
        pool,
        {}
      );

      // Action
      const result =
        await commentLikeRepositoryPostgres.getCommentsLikeCountsByThreadId(
          "thread-123"
        );

      // Result
      expect(result).toStrictEqual(expectedResult);
    });
  });
});
