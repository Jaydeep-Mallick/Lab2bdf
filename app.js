const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();

// Middleware to parse incoming JSON request bodies
app.use(express.json());

// Absolute path to the SQLite database file
const dbPath = path.join(__dirname, "books.db");
let db = null;

// ==========================================
// ROOT ROUTE (Convenience for Safari / Browsers)
// ==========================================
app.get("/", (req, res) => {
  res.redirect("/books/");
});

// ==========================================
// CRUD ROUTE HANDLERS
// ==========================================

/**
 * 1. GET /books/
 * Retrieves all books from the database.
 * HTTP 200 OK: returns an array of book objects.
 * HTTP 500: database or server error.
 */
app.get("/books/", async (req, res) => {
  try {
    const getBooksQuery = `
      SELECT *
      FROM book
      ORDER BY id;
    `;
    const books = await db.all(getBooksQuery);
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 2. GET /books/:bookId/
 * Retrieves a single book by its ID.
 * HTTP 200 OK: returns the book object.
 * HTTP 400 Bad Request: if bookId is not a valid number.
 * HTTP 404 Not Found: if no book with bookId exists.
 * HTTP 500: database or server error.
 */
app.get("/books/:bookId/", async (req, res) => {
  try {
    const { bookId } = req.params;

    if (isNaN(bookId)) {
      return res.status(400).json({ error: "Invalid book ID format. It must be a number." });
    }

    const getBookQuery = `
      SELECT *
      FROM book
      WHERE id = ?;
    `;
    const book = await db.get(getBookQuery, [bookId]);

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 3. POST /books/
 * Inserts a new book into the database.
 * HTTP 201 Created: returns confirmation message and new book ID.
 * HTTP 400 Bad Request: if required fields are missing.
 * HTTP 500: database or server error.
 */
app.post("/books/", async (req, res) => {
  try {
    const { title, author, price, pages } = req.body;

    if (!title || !author || price === undefined || pages === undefined) {
      return res.status(400).json({
        error: "Missing required fields: title, author, price, and pages are required.",
      });
    }

    const addBookQuery = `
      INSERT INTO book (title, author, price, pages)
      VALUES (?, ?, ?, ?);
    `;
    const result = await db.run(addBookQuery, [title, author, price, pages]);

    res.status(201).json({
      message: "Book Added Successfully",
      bookId: result.lastID,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 4. PUT /books/:bookId/
 * Updates an existing book's details by ID.
 * HTTP 200 OK: returns confirmation message.
 * HTTP 400 Bad Request: if bookId is invalid or fields are missing.
 * HTTP 404 Not Found: if no book with bookId exists.
 * HTTP 500: database or server error.
 */
app.put("/books/:bookId/", async (req, res) => {
  try {
    const { bookId } = req.params;

    if (isNaN(bookId)) {
      return res.status(400).json({ error: "Invalid book ID format. It must be a number." });
    }

    const { title, author, price, pages } = req.body;

    if (!title || !author || price === undefined || pages === undefined) {
      return res.status(400).json({
        error: "Missing required fields: title, author, price, and pages are required.",
      });
    }

    // Check if the book exists before updating
    const checkBookQuery = `
      SELECT *
      FROM book
      WHERE id = ?;
    `;
    const existingBook = await db.get(checkBookQuery, [bookId]);

    if (!existingBook) {
      return res.status(404).json({ error: "Book not found" });
    }

    const updateBookQuery = `
      UPDATE book
      SET
        title = ?,
        author = ?,
        price = ?,
        pages = ?
      WHERE id = ?;
    `;
    await db.run(updateBookQuery, [title, author, price, pages, bookId]);

    res.status(200).json({ message: "Book Details Updated Successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 5. DELETE /books/:bookId/
 * Deletes a book by its ID.
 * HTTP 200 OK: returns confirmation message.
 * HTTP 400 Bad Request: if bookId is not a valid number.
 * HTTP 404 Not Found: if no book with bookId exists.
 * HTTP 500: database or server error.
 */
app.delete("/books/:bookId/", async (req, res) => {
  try {
    const { bookId } = req.params;

    if (isNaN(bookId)) {
      return res.status(400).json({ error: "Invalid book ID format. It must be a number." });
    }

    // Check if the book exists before deleting
    const checkBookQuery = `
      SELECT *
      FROM book
      WHERE id = ?;
    `;
    const existingBook = await db.get(checkBookQuery, [bookId]);

    if (!existingBook) {
      return res.status(404).json({ error: "Book not found" });
    }

    const deleteBookQuery = `
      DELETE FROM book
      WHERE id = ?;
    `;
    await db.run(deleteBookQuery, [bookId]);

    res.status(200).json({ message: "Book Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// DATABASE & SERVER INITIALIZATION
// ==========================================

/**
 * Initializes the SQLite database connection and starts the Express server.
 * Ensures the database is ready and the table exists before accepting requests.
 */
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    // Create the book table if it does not already exist
    await db.run(`
      CREATE TABLE IF NOT EXISTS book (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        author TEXT,
        price INTEGER,
        pages INTEGER
      );
    `);

    const PORT = 3000;
    app.listen(PORT, () => {
      console.log(`Server Running at http://localhost:${PORT}/`);
    });
  } catch (error) {
    console.error(`Database Error: ${error.message}`);
    process.exit(1);
  }
};

// Start database connection and Express server
initializeDBAndServer();

module.exports = app;
