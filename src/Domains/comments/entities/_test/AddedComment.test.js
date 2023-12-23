const AddedComment = require("../AddedComment");

describe("an AddedComment entity", () => {
  it("should throw error if payload doesn't have needed property", () => {
    const payload = {
      content: "test thread comment",
      owner: "user-123",
    };

    expect(() => new AddedComment(payload)).toThrowError(
      "ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload has invalid data type", () => {
    const payload = {
      content: "test thread comment",
      owner: {},
      id: "reply-123",
    };

    expect(() => new AddedComment(payload)).toThrowError(
      "ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create AddedComment object correctly", () => {
    const payload = {
      content: "test thread comment",
      owner: "user-123",
      id: "comment-123",
    };

    const addedComment = new AddedComment(payload);

    expect(addedComment.content).toEqual(payload.content);
    expect(addedComment.owner).toEqual(payload.owner);
    expect(addedComment.id).toEqual(payload.id);
  });
});
