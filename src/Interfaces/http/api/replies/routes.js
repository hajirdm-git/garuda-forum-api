const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads/{threadId}/comments/{commentId}/replies',
    handler: handler.postReplyCommentHandler,
    options: {
      auth: 'garudaapi_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}/replies/{replyId}',
    handler: handler.postDeleteReplyCommentHandler,
    options: {
      auth: 'garudaapi_jwt',
    },
  },
]);

module.exports = routes;
