const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const CommentRepliesTableTestHelper = require("../../../../tests/CommentRepliesTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const ServerTestHelper = require("../../../../tests/ServerTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const container = require("../../container");
const pool = require("../../database/postgres/pool");
const createServer = require("../createServer");

describe("/threads/{threadId}/comments/{commentId}/replies endpoint", () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await CommentRepliesTableTestHelper.cleanTable();
  });

  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ username: "Reza" });
    await ThreadsTableTestHelper.addThread({});
    await CommentsTableTestHelper.addComment({});
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("when POST /threads/{threadId}/comments/{commentId}/replies", () => {
    it("should response 401 when request missing authentication", async () => {
      // Arrange
      const requestPayload = {
        content: "test comment",
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads/thread-123/comments/comment-123/replies",
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual("Unauthorized");
      expect(responseJson.message).toEqual("Missing authentication");
    });

    it("should response 400 when request payload not contain needed property", async () => {
      // Arrange
      const requestPayload = {};

      const server = await createServer(container);

      const { accessToken } =
        await ServerTestHelper.getAccessTokenAndUserIdHelper({ server });

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads/thread-123/comments/comment-123/replies",
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      //   Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "tidak dapat menambahkan komentar balasan karena properti yang dibutuhkan tidak ada"
      );
    });

    it("should response 400 when request payload not meet data type specification", async () => {
      // Arrange
      const requestPayload = {
        content: 123,
      };

      const server = await createServer(container);

      const { accessToken } =
        await ServerTestHelper.getAccessTokenAndUserIdHelper({ server });

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads/thread-123/comments/comment-123/replies",
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      //   Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "tidak dapat menambahkan komentar balasan karena tipe data pada properti tidak sesuai"
      );
    });

    it("should response 404 if thread not found", async () => {
      // Arrange
      const requestPayload = {
        content: "test comment",
      };

      const server = await createServer(container);

      const { accessToken } =
        await ServerTestHelper.getAccessTokenAndUserIdHelper({ server });

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads/thread-125/comments/comment-123/replies",
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      //   Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("Thread tidak ditemukan");
    });

    it("should response 404 if comment not found", async () => {
      // Arrange
      const requestPayload = {
        content: "test comment",
      };

      const server = await createServer(container);

      const { accessToken } =
        await ServerTestHelper.getAccessTokenAndUserIdHelper({ server });

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads/thread-123/comments/comment-100/replies",
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      //   Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("Komentar tidak ditemukan");
    });

    it("should response 201 and persisted comment", async () => {
      // Arrange
      const requestPayload = {
        content: "test comment",
      };

      const server = await createServer(container);
      const { accessToken } =
        await ServerTestHelper.getAccessTokenAndUserIdHelper({ server });

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads/thread-123/comments/comment-123/replies",
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      //   Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.addedReply).toBeDefined();
    });

    describe("when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}", () => {
      it("should response 401 when request missing authentication", async () => {
        // Arrange
        const requestPayload = {
          threadId: "thread-123",
          commentId: "comment-123",
          replyId: "reply-123",
        };

        await CommentRepliesTableTestHelper.addCommentReply({});
        const server = await createServer(container);

        // Action
        const response = await server.inject({
          method: "DELETE",
          url: `/threads/${requestPayload.threadId}/comments/${requestPayload.commentId}/replies/${requestPayload.replyId}`,
        });

        // Assert
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toEqual(401);
        expect(responseJson.error).toEqual("Unauthorized");
        expect(responseJson.message).toEqual("Missing authentication");
      });

      it("should response 403 when delete comment reply with invalid owner", async () => {
        // Arrange
        const requestPayload = {
          threadId: "thread-123",
          commentId: "comment-123",
          replyId: "reply-123",
        };

        const server = await createServer(container);

        const { accessToken: invalidUserAccessToken } =
          await ServerTestHelper.getAccessTokenAndUserIdHelper({
            server,
            username: "user2",
          });

        await CommentRepliesTableTestHelper.addCommentReply({
          // user have been added in before each function
          owner: "user-123",
          threadId: "thread-123",
        });

        // Action
        const response = await server.inject({
          method: "DELETE",
          url: `/threads/${requestPayload.threadId}/comments/${requestPayload.commentId}/replies/${requestPayload.replyId}`,
          headers: {
            authorization: `Bearer ${invalidUserAccessToken}`,
          },
        });

        // Assert
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toEqual(403);
        expect(responseJson.status).toEqual("fail");
        expect(responseJson.message).toEqual(
          "Anda bukan pemilik dari komentar balasan tersebut"
        );
      });

      it("should response 404 when comment not found", async () => {
        // Arrange
        const requestPayload = {
          threadId: "thread-123",
          commentId: "comment-123dfdf",
          replyId: "reply-123",
        };

        const server = await createServer(container);
        const { accessToken } =
          await ServerTestHelper.getAccessTokenAndUserIdHelper({ server });

        await CommentRepliesTableTestHelper.addCommentReply({});

        // Action
        const response = await server.inject({
          method: "DELETE",
          url: `/threads/${requestPayload.threadId}/comments/${requestPayload.commentId}/replies/${requestPayload.replyId}`,
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        });

        // Assert
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toEqual(404);
        expect(responseJson.status).toEqual("fail");
        expect(responseJson.message).toEqual("Komentar tidak ditemukan");
      });

      it("should response 404 when comment reply not found", async () => {
        // Arrange
        const requestPayload = {
          threadId: "thread-123",
          commentId: "comment-123",
          replyId: "reply-1232121",
        };

        const server = await createServer(container);
        const { accessToken } =
          await ServerTestHelper.getAccessTokenAndUserIdHelper({ server });

        await CommentRepliesTableTestHelper.addCommentReply({});

        // Action
        const response = await server.inject({
          method: "DELETE",
          url: `/threads/${requestPayload.threadId}/comments/${requestPayload.commentId}/replies/${requestPayload.replyId}`,
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        });

        // Assert
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toEqual(404);
        expect(responseJson.status).toEqual("fail");
        expect(responseJson.message).toEqual(
          "Komentar balasan tidak ditemukan"
        );
      });

      it("should response 200 when comment reply deleted correctly", async () => {
        // Arrange
        const requestPayload = {
          threadId: "thread-123",
          commentId: "comment-123",
          replyId: "reply-123",
        };
        const server = await createServer(container);
        const { userId, accessToken } =
          await ServerTestHelper.getAccessTokenAndUserIdHelper({ server });

        await CommentRepliesTableTestHelper.addCommentReply({ owner: userId });

        // Action
        const response = await server.inject({
          method: "DELETE",
          url: `/threads/${requestPayload.threadId}/comments/${requestPayload.commentId}/replies/${requestPayload.replyId}`,
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        });

        // Assert
        const commentReplies =
          await CommentRepliesTableTestHelper.findUndeletedCommentReplyById(
            "reply-123"
          );
        expect(commentReplies).toHaveLength(0);
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toEqual(200);
        expect(responseJson.status).toEqual("success");
      });
    });
  });
});
