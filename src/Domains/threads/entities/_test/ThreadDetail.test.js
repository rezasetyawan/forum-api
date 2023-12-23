const ThreadDetail = require("../ThreadDetail");

describe("a ThreadDetail entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    const payload = {
      body: "lagi test thread banh",
    };

    expect(() => new ThreadDetail(payload)).toThrowError(
      "GET_THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    const payload = {
      id: "thread-123",
      title: "test thread",
      body: "lagi test thread banh",
      date: new Date().toISOString(),
      username: 12,
      comments: "dfdfdf",
    };

    expect(() => new ThreadDetail(payload)).toThrowError(
      "GET_THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create threadDetail object correctly", () => {
    const payload = {
      id: "thread-123",
      title: "test thread",
      body: "lagi test thread banh",
      date: new Date().toISOString(),
      username: "Reza",
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
