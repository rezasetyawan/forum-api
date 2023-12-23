/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("comment_replies", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    content: {
      type: "TEXT",
      notNull: true,
    },
    owner: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    comment_id: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    thread_id: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    date: {
      type: "TEXT",
      notNull: true,
    },
    is_delete: {
      type: "BOOLEAN",
      notNull: true,
      default: false,
    },
  });

  pgm.addConstraint(
    "comment_replies",
    "fk_comment_replies.owner_users.id",
    "FOREIGN KEY (owner) REFERENCES users(id) ON DELETE CASCADE"
  );

  pgm.addConstraint(
    "comment_replies",
    "fk_comment_replies.thread_id_threads.id",
    "FOREIGN KEY (thread_id) REFERENCES threads(id) ON DELETE CASCADE"
  );

  pgm.addConstraint(
    "comment_replies",
    "fk_comment_replies.comment_id_comment.id",
    "FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE"
  );
};

exports.down = (pgm) => {
  pgm.dropTable("comment_replies");
};
