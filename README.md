# BDF Lab 2: SQLite Database and CRUD Routes

This repository contains the implementation of **BDF Lab 2: SQLite Database and CRUD Routes** using **Node.js**, **Express**, and **SQLite (`sqlite`, `sqlite3`)**.

The application manages a book inventory with persistent storage in an SQLite database file named `books.db` and exposes 5 RESTful CRUD endpoints with parameterized SQL queries and standard HTTP status codes.

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Database Schema](#database-schema)
3. [Prerequisites](#prerequisites)
4. [Installation & Setup](#installation--setup)
5. [Database Initialization](#database-initialization)
6. [Running the Application](#running-the-application)
7. [API Endpoints Documentation](#api-endpoints-documentation)
8. [Testing the Endpoints with cURL](#testing-the-endpoints-with-curl)
9. [Viva Preparation & Concept Explanations](#viva-preparation--concept-explanations)
10. [Screenshots](#screenshots)

---

## Project Overview

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** SQLite3 with `sqlite` (Promise-based wrapper)
- **Database File:** `books.db`
- **Development Tool:** Nodemon (for live hot-reloading)

---

## Database Schema

Table Name: `book`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique auto-incremented identifier for each book |
| `title` | TEXT | NOT NULL | Title of the book |
| `author` | TEXT | NOT NULL | Name of the author |
| `price` | INTEGER | NOT NULL | Price in local currency |
| `pages` | INTEGER | NOT NULL | Total page count |

---

## Prerequisites

- **Node.js**: v18 or higher (tested on v24.x)
- **npm**: v9 or higher
- **SQLite CLI**: `sqlite3` installed in your terminal environment (`/usr/bin/sqlite3`)

---

## Installation & Setup

1. Open your terminal and navigate to the project directory:
   ```bash
   cd /path/to/lab-02
   ```

2. If dependencies are not already installed, run:
   ```bash
   npm install
   ```

---

## Database Initialization

As required by the lab, sample records are not inserted automatically from `app.js`. Instead, execute `setup.sql` using the SQLite CLI to create the table and seed 10 realistic sample books:

```bash
sqlite3 books.db < setup.sql
```

You can verify the inserted records using SQLite CLI:
```bash
sqlite3 books.db "SELECT * FROM book;"
```

---

## Running the Application

### 1. Development Mode (using Nodemon)
Runs the server with Nodemon so it restarts automatically on file changes:
```bash
npm run dev
```

### 2. Standard Mode
```bash
npm start
```

Upon successful startup, the terminal will display:
```
Server Running at http://localhost:3000/
```

---

## API Endpoints Documentation

### Summary of Endpoints

| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| `GET` | `/books/` | Retrieve all books | 200, 500 |
| `GET` | `/books/:bookId/` | Retrieve a single book by ID | 200, 400, 404, 500 |
| `POST` | `/books/` | Add a new book | 201, 400, 500 |
| `PUT` | `/books/:bookId/` | Update book details by ID | 200, 400, 404, 500 |
| `DELETE` | `/books/:bookId/` | Delete a book by ID | 200, 400, 404, 500 |

---

### Detailed Endpoint Specifications

#### 1. GET `/books/`
- **Description:** Returns all books ordered by `id`.
- **Method:** `GET`
- **URL:** `http://localhost:3000/books/`
- **Response Status:** `200 OK`
- **Response Body Example:**
  ```json
  [
    {
      "id": 1,
      "title": "To Kill a Mockingbird",
      "author": "Harper Lee",
      "price": 450,
      "pages": 281
    },
    {
      "id": 2,
      "title": "1984",
      "author": "George Orwell",
      "price": 399,
      "pages": 328
    }
  ]
  ```

---

#### 2. GET `/books/:bookId/`
- **Description:** Returns a single book identified by `bookId`.
- **Method:** `GET`
- **URL:** `http://localhost:3000/books/1/`
- **Success Status:** `200 OK`
- **Response Body Example:**
  ```json
  {
    "id": 1,
    "title": "To Kill a Mockingbird",
    "author": "Harper Lee",
    "price": 450,
    "pages": 281
  }
  ```
- **Error Responses:**
  - `400 Bad Request` if `bookId` is not a valid number:
    ```json
    { "error": "Invalid book ID format. It must be a number." }
    ```
  - `404 Not Found` if book does not exist:
    ```json
    { "error": "Book not found" }
    ```

---

#### 3. POST `/books/`
- **Description:** Creates a new book in the database.
- **Method:** `POST`
- **URL:** `http://localhost:3000/books/`
- **Headers:** `Content-Type: application/json`
- **Request Body Example:**
  ```json
  {
    "title": "The Alchemist",
    "author": "Paulo Coelho",
    "price": 350,
    "pages": 208
  }
  ```
- **Success Status:** `201 Created`
- **Response Body Example:**
  ```json
  {
    "message": "Book Added Successfully",
    "bookId": 11
  }
  ```
- **Error Response:**
  - `400 Bad Request` if required fields are missing:
    ```json
    { "error": "Missing required fields: title, author, price, and pages are required." }
    ```

---

#### 4. PUT `/books/:bookId/`
- **Description:** Updates all fields of an existing book identified by `bookId`.
- **Method:** `PUT`
- **URL:** `http://localhost:3000/books/1/`
- **Headers:** `Content-Type: application/json`
- **Request Body Example:**
  ```json
  {
    "title": "To Kill a Mockingbird (Special Edition)",
    "author": "Harper Lee",
    "price": 520,
    "pages": 300
  }
  ```
- **Success Status:** `200 OK`
- **Response Body Example:**
  ```json
  {
    "message": "Book Details Updated Successfully"
  }
  ```
- **Error Responses:**
  - `400 Bad Request` if fields are missing or ID is not a number.
  - `404 Not Found` if the book ID does not exist in the database.

---

#### 5. DELETE `/books/:bookId/`
- **Description:** Deletes a book identified by `bookId`.
- **Method:** `DELETE`
- **URL:** `http://localhost:3000/books/10/`
- **Success Status:** `200 OK`
- **Response Body Example:**
  ```json
  {
    "message": "Book Deleted Successfully"
  }
  ```
- **Error Responses:**
  - `400 Bad Request` if `bookId` is not a number.
  - `404 Not Found` if the book ID does not exist.

---

## Testing the Endpoints with cURL

Run these commands in a separate terminal window while your server is running (`npm run dev`):

### 1. Test GET All Books
```bash
curl -i http://localhost:3000/books/
```

### 2. Test GET One Book by ID
```bash
curl -i http://localhost:3000/books/1/
```

### 3. Test POST (Add New Book)
```bash
curl -i -X POST http://localhost:3000/books/ \
  -H "Content-Type: application/json" \
  -d '{"title": "The Alchemist", "author": "Paulo Coelho", "price": 350, "pages": 208}'
```

### 4. Test PUT (Update Existing Book)
```bash
curl -i -X PUT http://localhost:3000/books/1/ \
  -H "Content-Type: application/json" \
  -d '{"title": "To Kill a Mockingbird (Revised)", "author": "Harper Lee", "price": 499, "pages": 290}'
```

### 5. Test DELETE (Delete Book)
```bash
curl -i -X DELETE http://localhost:3000/books/10/
```

### 6. Test 404 Error (Non-existent ID)
```bash
curl -i http://localhost:3000/books/999/
```

### 7. Test 400 Bad Request (Missing field)
```bash
curl -i -X POST http://localhost:3000/books/ \
  -H "Content-Type: application/json" \
  -d '{"title": "Incomplete Book"}'
```

---

## Viva Preparation & Concept Explanations

1. **Why `initializeDBAndServer()`?**
   - Opening an SQLite database is an asynchronous operation. If Express starts listening for requests before the database connection is established, incoming queries will crash with an uninitialized database error. `initializeDBAndServer()` guarantees that the connection is open and the table exists before `app.listen()` is executed.

2. **Why Parameterized Queries (`?` Placeholders)?**
   - Directly interpolating user variables into SQL query strings exposes the application to **SQL Injection (SQLi)** attacks.
   - When using `?`, the database driver handles variables as pure values/literals, preventing malicious SQL instructions from being executed.

3. **`db.all()` vs `db.get()` vs `db.run()`**:
   - `db.all(query, params)`: Returns an array of objects matching the query (used for `SELECT *`).
   - `db.get(query, params)`: Returns a single object for the first matching record (used for `WHERE id = ?`).
   - `db.run(query, params)`: Executes write queries (`INSERT`, `UPDATE`, `DELETE`, `CREATE TABLE`) and returns an object containing `lastID` and `changes`.

4. **HTTP Status Codes Used**:
   - `200 OK`: Successful read, update, or delete.
   - `201 Created`: Successful creation of a new book via POST.
   - `400 Bad Request`: Client provided missing or invalid parameters.
   - `404 Not Found`: The requested resource (bookId) does not exist in the database.
   - `500 Internal Server Error`: Unexpected server or database exception.

---

## Screenshots

Place your lab execution screenshots in the `screenshots/` directory using the filenames below:

1. **Database Setup via SQLite CLI**
   ![Database Setup](screenshots/01_sqlite_setup.png)

2. **Server Startup with Nodemon**
   ![Nodemon Server Startup](screenshots/02_server_startup.png)

3. **GET /books/ (All Books)**
   ![GET All Books](screenshots/03_get_all_books.png)

4. **GET /books/:bookId/ (Single Book)**
   ![GET Single Book](screenshots/04_get_book_by_id.png)

5. **POST /books/ (Insert Book - 201 Created)**
   ![POST Add Book](screenshots/05_post_add_book.png)

6. **PUT /books/:bookId/ (Update Book - 200 OK)**
   ![PUT Update Book](screenshots/06_put_update_book.png)

7. **DELETE /books/:bookId/ (Delete Book - 200 OK)**
   ![DELETE Book](screenshots/07_delete_book.png)

8. **404 Not Found Error Handling**
   ![404 Error Handling](screenshots/08_error_404.png)
