const routes = (handler) => [
  {
    method: "POST",
    path: "/threads",
    handler: handler.postThreadHandler,
    options: {
      auth: "forumapi_jwt",
    },
  },
  {
    method: "GET",
    path: "/threads/{id}",
    handler: handler.getThreadDetailByIdHandler,
  },
  {
    method: "POST",
    path: "/threads/{id}/comments",
    handler: handler.postThreadCommentByIdHandler,
    options: {
      auth: "forumapi_jwt",
    },
  },
  {
    method: "DELETE",
    path: "/threads/{threadId}/comments/{commentId}",
    handler: handler.deleteCommentFromThreadHandler,
    options: {
      auth: "forumapi_jwt",
    },
  },
  {
    method: "POST",
    path: "/threads/{threadId}/comments/{commentId}/replies",
    handler: handler.postThreadCommentReplyByIdHandler,
    options: {
      auth: "forumapi_jwt",
    },
  },
  {
    method: "DELETE",
    path: "/threads/{threadId}/comments/{commentId}/replies/{replyId}",
    handler: handler.deleteCommentReplyFromCommentHandler,
    options: {
      auth: "forumapi_jwt",
    },
  },
];

module.exports = routes;
