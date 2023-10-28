/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('comment_likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    threadId: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    commentId: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    like: {
      type: 'boolean',
      notNull: true,
    },
  });

  pgm.addConstraint(
    'comment_likes',
    'fk_comment_likes.threadId_threads.id',
    'FOREIGN KEY("threadId") REFERENCES threads(id) ON DELETE CASCADE',
  );

  pgm.addConstraint(
    'comment_likes',
    'fk_comment_likes.commentId_comments.id',
    'FOREIGN KEY("commentId") REFERENCES comments(id) ON DELETE CASCADE',
  );

  pgm.addConstraint(
    'comment_likes',
    'fk_comment_likes.owner_users.id',
    'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  pgm.dropTable('comment_likes');
};
