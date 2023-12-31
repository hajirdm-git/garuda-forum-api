/* eslint-disable no-underscore-dangle */
const InvariantError = require('./InvariantError');

const DomainErrorTranslator = {
  translate(error) {
    return DomainErrorTranslator._directories[error.message] || error;
  },
};

DomainErrorTranslator._directories = {
  'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'),
  'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat user baru karena tipe data tidak sesuai'),
  'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError('tidak dapat membuat user baru karena karakter username melebihi batas limit'),
  'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang'),
  'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('harus mengirimkan username dan password'),
  'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('username dan password harus string'),
  'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
  'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),
  'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
  'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),

  'NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada'),
  'NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat thread baru karena tipe data tidak sesuai'),
  'NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat user baru karena tipe data tidak sesuai'),
  'NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada'),
  'DELETE_THREAD_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_ATTRIBUTE': new InvariantError('tidak dapat menghapus comment karena data tidak lengkap'),
  'DELETE_THREAD_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat menghapus comment karena tipe data tidak sesuai'),
  'COMMENT_DELETE.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat menghapus commnet karena properti yang dibutuhkan tidak ada'),
  'COMMENT_DELETE.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat menghapus commnet karena type data tidak sesuai'),
  'ADD_COMMENT_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_ATTRIBUTE': new InvariantError('tidak dapat menghapus comment karena data tidak lengkap'),
  'ADD_COMMENT_REPLY_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat menghapus comment karena tipe data tidak sesuai'),

  'REPLY_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membalas comment karena properti yang dibutuhkan tidak ada'),
  'REPLY_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membalas comment karena properti yang dibutuhkan sesuai'),
  'DELETE_REPLY_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat menghapus balasan comment karena properti yang dibutuhkan sesuai'),
};

module.exports = DomainErrorTranslator;
