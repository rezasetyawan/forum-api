/* eslint-disable max-len */
const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const ServerTestHelper = require("../../../../tests/ServerTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const container = require("../../container");
const pool = require("../../database/postgres/pool");
const createServer = require("../createServer");

describe("/threads/{threadId}/comments/{commentId}/likes endpoint", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    // TODO: make user comment like table helper to clean table
  });

  describe("when PUT /threads/{threadId}/comments/{commentId}/likes", () => {
    it("sould response 401 when missing authentication", async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: "PUT",
        url: "/threads/thread-123/comments/comment-123/likes",
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual("Unauthorized");
    });

    it("sould response 404 when comment is not found", async () => {
      const server = await createServer(container);
      const { accessToken } =
        await ServerTestHelper.getAccessTokenAndUserIdHelper({ server });

      const response = await server.inject({
        method: "PUT",
        url: "/threads/thread-123/comments/comment-123/likes",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
    });

    it("sould response 200 when like or unlike success", async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const server = await createServer(container);
      const { accessToken } =
        await ServerTestHelper.getAccessTokenAndUserIdHelper({
          server,
          username: "x",
        });

      const response = await server.inject({
        method: "PUT",
        url: "/threads/thread-123/comments/comment-123/likes",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
    });
  });
});
