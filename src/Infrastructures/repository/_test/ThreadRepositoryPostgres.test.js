const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end;
  });

  describe('addThread function', () => {
    it('should persist new thread and return added thread correctly', async () => {
      // Arange
      await UsersTableTestHelper.addUser({});
      const newThread = new AddThread({
        title: 'test thread',
        body: 'lagi test thread banh',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
          pool,
          fakeIdGenerator,
      );

      await threadRepositoryPostgres.addThread(newThread);

      // Action
      const thread = await ThreadsTableTestHelper.findThreadById('thread-123');

      // Asert
      expect(thread).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      // Arange
      await UsersTableTestHelper.addUser({});
      const newThread = new AddThread({
        title: 'test thread',
        body: 'lagi test thread banh',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
          pool,
          fakeIdGenerator,
      );

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(newThread);

      // Asert
      expect(addedThread).toStrictEqual(
          new AddedThread({
            id: 'thread-123',
            title: 'test thread',
            owner: 'user-123',
          }),
      );
    });
  });

  describe('isThreadExist function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      // Arange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, '');

      // Action & Assert
      await expect(
          threadRepositoryPostgres.isThreadExist('1'),
      ).rejects.toThrowError(NotFoundError);
    });

    it('should return nothing when thread found', async () => {
      // Asert
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, '');

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({id: 'thread-1'});

      // Action & Assert
      await expect(
          threadRepositoryPostgres.isThreadExist('thread-1'),
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('getThreadDetailById function', () => {
    it('should return thread correctly', async () => {
      // Arange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, '');

      await UsersTableTestHelper.addUser({
        username: 'Reza',
        fullname: 'Reza Setyawan',
      });

      const currentDate = new Date().toISOString();
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'test thread ',
        body: 'lagi test thread banh',
        date: currentDate,
        owner: 'user-123',
      });

      // Action
      const thread = await threadRepositoryPostgres.getThreadDetailById(
          'thread-123',
      );

      // Assert
      expect(thread).toStrictEqual({
        id: 'thread-123',
        title: 'test thread ',
        body: 'lagi test thread banh',
        date: currentDate,
        username: 'Reza',
      });
    });
  });
});
