const CommentLikesTableTestHelper = require('../../../../tests/CommentLikesTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const CommentLikeRepositoryPostgres = require('../CommentLikeRepositoryPostgres');

describe('CommentLikeRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentLikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addLike function', () => {
    it('should persist like and return correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });

      const fakeIdGenerator = () => '123';
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, fakeIdGenerator);

      await commentLikeRepositoryPostgres.addLike('comment-123', 'user-123');

      const likes = await CommentLikesTableTestHelper.findLikeById('like-123');
      expect(likes).toHaveLength(1);
    });
  });

  describe('deleteLike function', () => {
    it('should delete like correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      await CommentLikesTableTestHelper.addLike({
        id: 'like-123',
        commentId: 'comment-123',
        owner: 'user-123',
      });

      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, {});

      await commentLikeRepositoryPostgres.deleteLike('comment-123', 'user-123');

      const likes = await CommentLikesTableTestHelper.findLikeById('like-123');
      expect(likes).toHaveLength(0);
    });
  });

  describe('verifyLikeExists function', () => {
    it('should return true when like exists', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      await CommentLikesTableTestHelper.addLike({
        id: 'like-123',
        commentId: 'comment-123',
        owner: 'user-123',
      });

      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, {});

      const result = await commentLikeRepositoryPostgres.verifyLikeExists('comment-123', 'user-123');

      expect(result).toEqual(true);
    });

    it('should return false when like does not exist', async () => {
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, {});

      const result = await commentLikeRepositoryPostgres.verifyLikeExists('comment-123', 'user-123');

      expect(result).toEqual(false);
    });
  });

  describe('getLikeCountByCommentId function', () => {
    it('should return correct like count', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await UsersTableTestHelper.addUser({ id: 'user-456', username: 'user456' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      await CommentLikesTableTestHelper.addLike({
        id: 'like-123',
        commentId: 'comment-123',
        owner: 'user-123',
      });
      await CommentLikesTableTestHelper.addLike({
        id: 'like-456',
        commentId: 'comment-123',
        owner: 'user-456',
      });

      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, {});

      const count = await commentLikeRepositoryPostgres.getLikeCountByCommentId('comment-123');

      expect(count).toEqual(2);
    });

    it('should return 0 when no likes exist', async () => {
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, {});

      const count = await commentLikeRepositoryPostgres.getLikeCountByCommentId('comment-123');

      expect(count).toEqual(0);
    });
  });
});