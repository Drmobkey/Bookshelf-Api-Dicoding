const { nanoid } = require("nanoid");
const books = [];

const addBookHandler = (request, h) => {
  const {
    name, year, author,
    summary, publisher, pageCount,
    readPage, reading,
  } = request.payload;

  if (!name) {
    return h
      .response({
        status: "fail",
        message: "Gagal menambahkan buku. Mohon isi nama buku",
      })
      .code(400);
  }

  if (readPage > pageCount) {
    return h
      .response({
        status: "fail",
        message:
          "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
      })
      .code(400);
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  const newBook = {
    id, name, year,
    author, summary, publisher,
    pageCount, readPage, finished,
    reading, insertedAt, updatedAt,
  };
};

const getAllBooksHandler = () => {};

const getBookByIdHandler = () => {};

const updateBookHandler = (request, h) => {};

const deleteBookHandler = (request, h) => {};
