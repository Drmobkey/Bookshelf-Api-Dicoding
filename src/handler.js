const { nanoid } = require('nanoid');
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
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
      })
      .code(400);
  }

  if (readPage > pageCount) {
    return h
      .response({
        status: 'fail',
        message:
          'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
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

  books.push(newBook);

  return h
    .response({
      status: 'success',
      message: 'Buku berhasil ditambahkan'
  }).code(201);
};

const getAllBooksHandler = (request, h) => {
  try {
    const { name, reading, finished } = request.query; // Ambil query parameter

    // Mulai dengan semua buku
    let filteredBooks = books;

    // Filter berdasarkan nama (jika ada)
    if (name) {
      filteredBooks = filteredBooks.filter((book) =>
        book.name && book.name.toLowerCase().includes(name.toLowerCase())
      );
    }

    // Filter berdasarkan reading (jika ada)
    if (reading !== undefined) {
      filteredBooks = filteredBooks.filter(
        (book) => book.reading === (reading === '1')
      );
    }

    // Filter berdasarkan finished (jika ada)
    if (finished !== undefined) {
      filteredBooks = filteredBooks.filter(
        (book) => book.finished === (finished === '1')
      );
    }

    // Respons jika tidak ada buku yang cocok
    if (filteredBooks.length === 0) {
      return h.response({
        status: 'success',
        data: {
          books: [],
        },
      }).code(200);
    }

    // Respons sukses dengan data buku yang difilter
    return h.response({
      status: 'success',
      data: {
        books: filteredBooks.map(({ id, name, publisher }) => ({
          id,
          name,
          publisher,
        })),
      },
    }).code(200);
  } catch (error) {
    console.error('Error:', error); // Debugging: tangkap error
    return h.response({
      status: 'fail',
      message: 'Gagal mengambil data buku',
    }).code(500);
  }
};

const getBookByIdHandler = (request,h) => {
  const { bookId } = request.params;
  const book = books.find((b) => b.id === bookId);

  if ( !book ) {
    return h.response ({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    }).code(404);
    
  }

  return h.response ({
    status: 'success',
    data: {book},
  });


};

const updateBookHandler = (request, h) => {
  const {bookId} = request.params;
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
  const index = books.findIndex((b)=> b.id === bookId);

  if (index === -1) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    }).code(404);
  }
  
  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    }).code(400);
  }

  if (readPage>pageCount) {
    return h.response({
      status: 'fail',
      message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  const updatedAt= new Date().toISOString();
  const finished = pageCount === readPage;
  books[index] = { ...books[index], name, year, author, summary, publisher, pageCount, readPage, reading, finished, updatedAt };

  return h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  }).code(200);
};

const deleteBookHandler = (request, h) => {
  const{bookId} = request.params;
  const index = books.findIndex((b)=>b.id === bookId);

  if (index === -1) {
    return h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    }).code(404);
  }

  books.splice(index, 1);
  return h.response({
    status: 'success',
    message: 'Buku berhasil dihapus',
  }).code(200);
};

module.exports = {
 addBookHandler,
 getAllBooksHandler,
 getBookByIdHandler,
 updateBookHandler,
 deleteBookHandler,
};
