const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads/{threadId} endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('when GET /threads/{threadId}', () => {
    it('should response 200 and return thread detail', async () => {
      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'johndoe',
          password: 'secret',
          fullname: 'John Doe',
        },
      });

      const loginResponse1 = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const { data: { accessToken: accessToken1 } } = JSON.parse(loginResponse1.payload);

      const loginResponse2 = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'johndoe',
          password: 'secret',
        },
      });
      const { data: { accessToken: accessToken2 } } = JSON.parse(loginResponse2.payload);

      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'a thread',
          body: 'a thread body',
        },
        headers: {
          Authorization: `Bearer ${accessToken1}`,
        },
      });
      const { data: { addedThread } } = JSON.parse(threadResponse.payload);

      const commentResponse1 = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: {
          content: 'a comment',
        },
        headers: {
          Authorization: `Bearer ${accessToken2}`,
        },
      });
      const { data: { addedComment: addedComment1 } } = JSON.parse(commentResponse1.payload);

      const commentResponse2 = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: {
          content: 'deleted comment',
        },
        headers: {
          Authorization: `Bearer ${accessToken1}`,
        },
      });
      const { data: { addedComment: addedComment2 } } = JSON.parse(commentResponse2.payload);

      await server.inject({
        method: 'DELETE',
        url: `/threads/${addedThread.id}/comments/${addedComment2.id}`,
        headers: {
          Authorization: `Bearer ${accessToken1}`,
        },
      });

      const response = await server.inject({
        method: 'GET',
        url: `/threads/${addedThread.id}`,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.id).toEqual(addedThread.id);
      expect(responseJson.data.thread.title).toEqual('a thread');
      expect(responseJson.data.thread.body).toEqual('a thread body');
      expect(responseJson.data.thread.date).toBeDefined();
      expect(responseJson.data.thread.username).toEqual('dicoding');
      expect(responseJson.data.thread.comments).toHaveLength(2);
      expect(responseJson.data.thread.comments[0].id).toEqual(addedComment1.id);
      expect(responseJson.data.thread.comments[0].username).toEqual('johndoe');
      expect(responseJson.data.thread.comments[0].content).toEqual('a comment');
      expect(responseJson.data.thread.comments[0].replies).toEqual([]);
      expect(responseJson.data.thread.comments[1].id).toEqual(addedComment2.id);
      expect(responseJson.data.thread.comments[1].content).toEqual('**komentar telah dihapus**');
      expect(responseJson.data.thread.comments[1].replies).toEqual([]);
    });

    it('should response 404 when thread not found', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-999',
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });
  });
});
