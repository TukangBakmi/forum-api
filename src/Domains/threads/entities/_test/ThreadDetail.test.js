const ThreadDetail = require('../ThreadDetail');

describe('ThreadDetail entities', () => {
  it('should throw error when payload not contain needed property', () => {
    const payload = {
      id: 'thread-123',
      title: 'a thread',
    };

    expect(() => new ThreadDetail(payload)).toThrowError('THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when missing body', () => {
    const payload = {
      id: 'thread-123',
      title: 'a thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
      comments: [],
    };

    expect(() => new ThreadDetail(payload)).toThrowError('THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when missing date', () => {
    const payload = {
      id: 'thread-123',
      title: 'a thread',
      body: 'a thread body',
      username: 'dicoding',
      comments: [],
    };

    expect(() => new ThreadDetail(payload)).toThrowError('THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    const payload = {
      id: 'thread-123',
      title: 'a thread',
      body: 'a thread body',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
      comments: 'not an array',
    };

    expect(() => new ThreadDetail(payload)).toThrowError('THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when body is not string', () => {
    const payload = {
      id: 'thread-123',
      title: 'a thread',
      body: 123,
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
      comments: [],
    };

    expect(() => new ThreadDetail(payload)).toThrowError('THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when username is falsy', () => {
    const payload = {
      id: 'thread-123',
      title: 'a thread',
      body: 'a thread body',
      date: '2021-08-08T07:19:09.775Z',
      username: '',
      comments: [],
    };

    expect(() => new ThreadDetail(payload)).toThrowError('THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when comments is falsy', () => {
    const payload = {
      id: 'thread-123',
      title: 'a thread',
      body: 'a thread body',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
      comments: null,
    };

    expect(() => new ThreadDetail(payload)).toThrowError('THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when date is not string', () => {
    const payload = {
      id: 'thread-123',
      title: 'a thread',
      body: 'a thread body',
      date: 123,
      username: 'dicoding',
      comments: [],
    };

    expect(() => new ThreadDetail(payload)).toThrowError('THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when username is not string', () => {
    const payload = {
      id: 'thread-123',
      title: 'a thread',
      body: 'a thread body',
      date: '2021-08-08T07:19:09.775Z',
      username: 123,
      comments: [],
    };

    expect(() => new ThreadDetail(payload)).toThrowError('THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when only id is missing', () => {
    const payload = {
      title: 'a thread',
      body: 'a thread body',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
      comments: [],
    };

    expect(() => new ThreadDetail(payload)).toThrowError('THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when only title is missing', () => {
    const payload = {
      id: 'thread-123',
      body: 'a thread body',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
      comments: [],
    };

    expect(() => new ThreadDetail(payload)).toThrowError('THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when only id is wrong type', () => {
    const payload = {
      id: 123,
      title: 'a thread',
      body: 'a thread body',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
      comments: [],
    };

    expect(() => new ThreadDetail(payload)).toThrowError('THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when only title is wrong type', () => {
    const payload = {
      id: 'thread-123',
      title: 123,
      body: 'a thread body',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
      comments: [],
    };

    expect(() => new ThreadDetail(payload)).toThrowError('THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when comments is not array', () => {
    const payload = {
      id: 'thread-123',
      title: 'a thread',
      body: 'a thread body',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
      comments: 'not array',
    };

    expect(() => new ThreadDetail(payload)).toThrowError('THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create ThreadDetail object correctly', () => {
    const payload = {
      id: 'thread-123',
      title: 'a thread',
      body: 'a thread body',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
      comments: [],
    };

    const threadDetail = new ThreadDetail(payload);

    expect(threadDetail.id).toEqual(payload.id);
    expect(threadDetail.title).toEqual(payload.title);
    expect(threadDetail.body).toEqual(payload.body);
    expect(threadDetail.date).toEqual(payload.date);
    expect(threadDetail.username).toEqual(payload.username);
    expect(threadDetail.comments).toEqual(payload.comments);
  });
});
