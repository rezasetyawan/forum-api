class AddedComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const {id, content, owner} = payload;

    this.id = id;
    this.content = content;
    this.owner = owner;
  }

  _verifyPayload({id, content, owner}) {
    if (!content || !owner || !id) {
      throw new Error('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof content !== 'string' ||
      typeof owner !== 'string' ||
      typeof id !== 'string'
    ) {
      throw new Error('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddedComment;
