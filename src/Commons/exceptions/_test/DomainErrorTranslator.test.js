const DomainErrorTranslator = require("../DomainErrorTranslator");
const InvariantError = require("../InvariantError");

describe("DomainErrorTranslator", () => {
  it("should translate error correctly", () => {
    expect(
      DomainErrorTranslator.translate(
        new Error("REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY")
      )
    ).toStrictEqual(
      new InvariantError(
        "tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada"
      )
    );
    expect(
      DomainErrorTranslator.translate(
        new Error("REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION")
      )
    ).toStrictEqual(
      new InvariantError(
        "tidak dapat membuat user baru karena tipe data tidak sesuai"
      )
    );
    expect(
      DomainErrorTranslator.translate(
        new Error("REGISTER_USER.USERNAME_LIMIT_CHAR")
      )
    ).toStrictEqual(
      new InvariantError(
        "tidak dapat membuat user baru karena karakter username melebihi batas limit"
      )
    );
    expect(
      DomainErrorTranslator.translate(
        new Error("REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER")
      )
    ).toStrictEqual(
      new InvariantError(
        "tidak dapat membuat user baru karena username mengandung karakter terlarang"
      )
    );
    expect(
      DomainErrorTranslator.translate(
        new Error("ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY")
      )
    ).toStrictEqual(
      new InvariantError(
        "tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada"
      )
    );
    expect(
      DomainErrorTranslator.translate(
        new Error("ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION")
      )
    ).toStrictEqual(
      new InvariantError(
        "tidak dapat membuat thread baru karena tipe data pada properti tidak sesuai"
      )
    );
    expect(
      DomainErrorTranslator.translate(
        new Error("ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY")
      )
    ).toStrictEqual(
      new InvariantError(
        "tidak dapat menambahkan komentar karena properti yang dibutuhkan tidak ada"
      )
    );
    expect(
      DomainErrorTranslator.translate(
        new Error("ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION")
      )
    ).toStrictEqual(
      new InvariantError(
        "tidak dapat menambahkan komentar karena tipe data pada properti tidak sesuai"
      )
    );
    expect(
      DomainErrorTranslator.translate(
        new Error("GET_DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY")
      )
    ).toStrictEqual(
      new InvariantError(
        "gagal mendapatkan detail thread, property tidak lengkap"
      )
    );
    expect(
      DomainErrorTranslator.translate(
        new Error("GET_DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION")
      )
    ).toStrictEqual(
      new InvariantError(
        "gagal mendapatkan detail thread, tipe data tidak sesuai"
      )
    );
    expect(
      DomainErrorTranslator.translate(
        new Error("ADD_COMMENT_REPLY.NOT_CONTAIN_NEEDED_PROPERTY")
      )
    ).toStrictEqual(
      new InvariantError(
        "tidak dapat menambahkan komentar balasan karena properti yang dibutuhkan tidak ada"
      )
    );
    expect(
      DomainErrorTranslator.translate(
        new Error("ADD_COMMENT_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION")
      )
    ).toStrictEqual(
      new InvariantError(
        "tidak dapat menambahkan komentar balasan karena tipe data pada properti tidak sesuai"
      )
    );
  });

  it("should return original error when error message is not needed to translate", () => {
    // Arrange
    const error = new Error("some_error_message");

    // Action
    const translatedError = DomainErrorTranslator.translate(error);

    // Assert
    expect(translatedError).toStrictEqual(error);
  });
});