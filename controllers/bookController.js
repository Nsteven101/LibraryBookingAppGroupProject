import Book from '../models/Book.js';

export const getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createBook = async (req, res) => {
  const { title, author, year } = req.body;
  try {
    const newBook = await Book.create({ title, author, year });
    res.status(201).json(newBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json({ message: 'Book deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
export const borrowBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (!book.available) return res.status(400).json({ message: 'Book is already borrowed' });

    book.available = false;
    book.borrowedBy = req.user.id;
    await book.save();

    res.json({ message: 'Book borrowed successfully', book });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const returnBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.available || String(book.borrowedBy) !== req.user.id)
      return res.status(403).json({ message: 'You cannot return this book' });

    book.available = true;
    book.borrowedBy = null;
    await book.save();

    res.json({ message: 'Book returned successfully', book });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

