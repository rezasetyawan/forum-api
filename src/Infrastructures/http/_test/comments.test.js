const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const ServerTestHelper = require("../../../../tests/ServerTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const container = require("../../container");
const pool = require("../../database/postgres/pool");
const createServer = require("../createServer");

describe("/threads/{threadId}/comments endpoint", () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("when POST /threads/{threadId}/comments", () => {
    it("should response 401 when request missing authentication", async () => {
      // Arrange
      const requestPayload = {
        content: "test comment",
        owner: "user-123",
        threadId: "thread-123",
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads/thread-123/comments",
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
        url: "/threads/thread-123/comments",
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
        "tidak dapat menambahkan komentar karena properti yang dibutuhkan tidak ada"
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
        url: "/threads/thread-123/comments",
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
        "tidak dapat menambahkan komentar karena tipe data pada properti tidak sesuai"
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
        url: "/threads/thread-123/comments",
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

    it("should response 201 and persisted comment", async () => {
      // Arrange
      const requestPayload = {
        content: "test comment",
      };

      const server = await createServer(container);

      const { userId, accessToken } =
        await ServerTestHelper.getAccessTokenAndUserIdHelper({ server });

      await ThreadsTableTestHelper.addThread({ owner: userId });

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads/thread-123/comments",
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      //   Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.addedComment).toBeDefined();
    });
  });

  describe("when DELETE /threads/{threadId}/comments/{commentId}", () => {
    it("should response 401 when request missing authentication", async () => {
      // Arrange
      const requestPayload = {
        commentId: "comment-123",
        owner: "user-123",
        threadId: "thread-123",
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${requestPayload.threadId}/comments/${requestPayload.commentId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual("Unauthorized");
      expect(responseJson.message).toEqual("Missing authentication");
    });

    it("should response 403 when delete comment with invalid owner", async () => {
      // Arrange
      const requestPayload = {
        commentId: "comment-123",
        threadId: "thread-123",
      };

      const server = await createServer(container);
      const { userId: user1, accessToken: user1AccessToken } =
        await ServerTestHelper.getAccessTokenAndUserIdHelper({
          server,
          username: "user1",
        });

      const { userId: user2, accessToken: user2AccessToken } =
        await ServerTestHelper.getAccessTokenAndUserIdHelper({
          server,
          username: "user2",
        });

      await ThreadsTableTestHelper.addThread({ owner: user1 });
      await CommentsTableTestHelper.addComment({
        owner: user1,
        threadId: "thread-123",
      });

      // Action
      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${requestPayload.threadId}/comments/${requestPayload.commentId}`,
        headers: {
          authorization: `Bearer ${user2AccessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "Anda bukan pemilik dari komentar tersebut"
      );
    });

    it("should response 404 when comment or thread not found", async () => {
      // Arrange
      const requestPayload = {
        commentId: "comment-123",
        threadId: "thread-123",
      };
      const server = await createServer(container);
      const { accessToken } =
        await ServerTestHelper.getAccessTokenAndUserIdHelper({ server });

      // Action
      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${requestPayload.threadId}/comments/${requestPayload.commentId}`,
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

    it("should response 200 when comment deleted correctly", async () => {
      // Arrange
      const requestPayload = {
        commentId: "comment-123",
        threadId: "thread-123",
      };

      const server = await createServer(container);
      const { userId, accessToken } =
        await ServerTestHelper.getAccessTokenAndUserIdHelper({ server });

      await ThreadsTableTestHelper.addThread({
        id: requestPayload.threadId,
        owner: userId,
      });

      await CommentsTableTestHelper.addComment({
        id: requestPayload.commentId,
        owner: userId,
        threadId: requestPayload.threadId,
      });

      // Action
      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${requestPayload.threadId}/comments/${requestPayload.commentId}`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const comments = await CommentsTableTestHelper.findUndeletedCommentById(
        requestPayload.commentId
      );
      const responseJson = JSON.parse(response.payload);
      expect(comments).toHaveLength(0);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
    });
  });
});
