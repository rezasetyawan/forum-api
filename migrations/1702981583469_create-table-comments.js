/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.createTable('comments', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    content: {
      type: 'TEXT',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    thread_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    date: {
      type: 'TEXT',
      notNull: true,
    },
  });

  pgm.addConstraint(
      'comments',
      'fk_comments.owner_users.id',
      'FOREIGN KEY (owner) REFERENCES users(id) ON DELETE CASCADE',
  );

  pgm.addConstraint(
      'comments',
      'fk_comments.thread_id_threads.id',
      'FOREIGN KEY (thread_id) REFERENCES threads(id) ON DELETE CASCADE',
  );

  pgm.addColumn('comments', {
    is_delete: {
      type: 'BOOLEAN',
      notNull: true,
      default: false,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('comments');
};
