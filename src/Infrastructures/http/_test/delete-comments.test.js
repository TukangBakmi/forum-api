const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('DELETE /threads/{threadId}/comments/{commentId}', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  it('should response 200 and delete comment', async () => {
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

    const loginResponse = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: 'dicoding',
        password: 'secret',
      },
    });
    const { data: { accessToken } } = JSON.parse(loginResponse.payload);

    const threadResponse = await server.inject({
      method: 'POST',
      url: '/threads',
      payload: {
        title: 'sebuah thread',
        body: 'sebuah body thread',
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const { data: { addedThread } } = JSON.parse(threadResponse.payload);

    const commentResponse = await server.inject({
      method: 'POST',
      url: `/threads/${addedThread.id}/comments`,
      payload: {
        content: 'a comment',
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const { data: { addedComment } } = JSON.parse(commentResponse.payload);

    const response = await server.inject({
      method: 'DELETE',
      url: `/threads/${addedThread.id}/comments/${addedComment.id}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(200);
    expect(responseJson.status).toEqual('success');
  });

  it('should response 404 when comment not found', async () => {
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

    const loginResponse = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: 'dicoding',
        password: 'secret',
      },
    });
    const { data: { accessToken } } = JSON.parse(loginResponse.payload);

    const threadResponse = await server.inject({
      method: 'POST',
      url: '/threads',
      payload: {
        title: 'sebuah thread',
        body: 'sebuah body thread',
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const { data: { addedThread } } = JSON.parse(threadResponse.payload);

    const response = await server.inject({
      method: 'DELETE',
      url: `/threads/${addedThread.id}/comments/comment-999`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(404);
    expect(responseJson.status).toEqual('fail');
    expect(responseJson.message).toBeDefined();
  });

  it('should response 403 when user is not comment owner', async () => {
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
        title: 'sebuah thread',
        body: 'sebuah body thread',
      },
      headers: {
        Authorization: `Bearer ${accessToken1}`,
      },
    });
    const { data: { addedThread } } = JSON.parse(threadResponse.payload);

    const commentResponse = await server.inject({
      method: 'POST',
      url: `/threads/${addedThread.id}/comments`,
      payload: {
        content: 'a comment',
      },
      headers: {
        Authorization: `Bearer ${accessToken1}`,
      },
    });
    const { data: { addedComment } } = JSON.parse(commentResponse.payload);

    const response = await server.inject({
      method: 'DELETE',
      url: `/threads/${addedThread.id}/comments/${addedComment.id}`,
      headers: {
        Authorization: `Bearer ${accessToken2}`,
      },
    });

    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(403);
    expect(responseJson.status).toEqual('fail');
    expect(responseJson.message).toBeDefined();
  });

  it('should response 401 when request without authentication', async () => {
    const server = await createServer(container);

    const response = await server.inject({
      method: 'DELETE',
      url: '/threads/thread-123/comments/comment-123',
    });

    expect(response.statusCode).toEqual(401);
  });
});
