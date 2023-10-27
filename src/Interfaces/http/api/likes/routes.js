const routes = (handler) => ([
  {
    method: 'PUT',
    path: '/threads/{threadId}/comments/{commentId}/likes',
    handler: handler.putLikesHandler,
    options: {
      auth: 'garudaapi_jwt',
    },
  },
]);

module.exports = routes;
