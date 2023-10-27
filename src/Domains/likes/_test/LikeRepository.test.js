const LikeRepository = require('../LikeRepository');

describe('Like Repository Interface', () => {
  it('should throw error when invoke unimplemented method', async () => {
    // Arrange
    const likeRepository = new LikeRepository();

    // Action & Assert
    await expect(likeRepository.addLike('')).rejects
      .toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');

    await expect(likeRepository.removeLike('')).rejects
      .toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');

    await expect(likeRepository.checkIsLike('')).rejects
      .toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');

    await expect(likeRepository.verifyLikeOwner('')).rejects
      .toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');

    await expect(likeRepository.getLikeCountByCommentId('')).rejects
      .toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
