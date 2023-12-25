const CommentLikesHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "comment-like",
  register: async (server, { container }) => {
    const threadsHandler = new CommentLikesHandler(container);
    server.route(routes(threadsHandler));
  },
};
