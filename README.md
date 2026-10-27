# BDF Lab 2: SQLite Database and CRUD Routes (Render-Ready)

This repository contains the complete implementation of **BDF Lab 2: SQLite Database and CRUD Routes** built with **Node.js**, **Express**, and **SQLite (`sqlite`, `sqlite3`)**, configured and prepared for seamless deployment on **Render Web Services**.

The service manages a book catalog stored in an SQLite database (`books.db`) with 5 RESTful CRUD endpoints featuring parameterized SQL queries, clean HTTP status codes, idempotent schema/data initialization, and cloud deployment compatibility.

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Database Schema](#database-schema)
3. [Repository Structure](#repository-structure)
4. [Prerequisites](#prerequisites)
5. [Local Installation & Setup](#local-installation--setup)
6. [Database Initialization](#database-initialization)
7. [Running Locally](#running-locally)
8. [API Endpoints Documentation](#api-endpoints-documentation)
9. [Render Deployment Guide](#render-deployment-guide)
10. [SQLite Persistence on Cloud Platforms](#sqlite-persistence-on-cloud-platforms)
11. [Testing & Verification Guide](#testing--verification-guide)
12. [Troubleshooting & Viva Reference](#troubleshooting--viva-reference)

---

## Project Overview

- **Runtime Environment:** Node.js (>= 18.0.0)
- **Web Framework:** Express.js 5
- **Database Engine:** SQLite3 via `sqlite` (Promise-based async/await wrapper)
- **Default Database File:** `books.db` (configurable via `DB_PATH`)
- **Port:** Configured via `process.env.PORT || 3000`
- **Development Tool:** Nodemon (hot-reloading)
- **Deployment Target:** Render Web Services

---

## Database Schema

Table: `book`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique auto-generated book identifier |
| `title` | TEXT | NOT NULL | Title of the book |
| `author` | TEXT | NOT NULL | Full name of the author |
| `price` | INTEGER | NOT NULL | Book price in currency units |
| `pages` | INTEGER | NOT NULL | Total page count |

---

## Repository Structure

```text
.
├── .gitignore          # Ignores node_modules, .env, OS files, and logs
├── README.md           # Comprehensive project & deployment documentation
├── app.js              # Express app, CRUD routes, and DB initialization
├── books.db            # SQLite database file containing initial records
├── package.json        # Project metadata, scripts, and dependencies
├── package-lock.json   # Deterministic dependency tree
├── render.yaml         # Render Blueprint deployment configuration
├── screenshots/        # Folder for assignment screenshot submissions
│   └── .gitkeep
└── setup.sql           # SQL script for manual database & sample data setup
```

---

## Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Git**: For version control and pushing to GitHub

---

## Local Installation & Setup

1. Clone or open the project folder in your terminal:
   ```bash
   cd /path/to/Lab2bdf
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

---

## Database Initialization

The application handles database initialization in two ways:

1. **Automatic Idempotent Seeding (Recommended & Render-Ready):**
   When the server starts via `app.js`, it automatically creates the `book` table if it does not exist and seeds 10 sample books **only if the table is empty**. It preserves existing records and never inserts duplicates upon server restart.

2. **Manual Seeding via SQLite CLI:**
   You can also manually initialize or reset the database using `setup.sql`:
   ```bash
   sqlite3 books.db < setup.sql
   ```

---

## Running Locally

### Start in Production Mode
```bash
npm start
```

### Start in Development Mode (with Nodemon)
```bash
npm run dev
```

The terminal will log:
```text
Server Running at http://localhost:3000/
```

---

## API Endpoints Documentation

### Summary Table

| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| `GET` | `/` | Root convenience route (redirects to `/books/`) | 302 |
| `GET` | `/books/` | Retrieve all books ordered by ID | 200, 500 |
| `GET` | `/books/:bookId/` | Retrieve single book by ID | 200, 400, 404, 500 |
| `POST` | `/books/` | Insert a new book | 201, 400, 500 |
| `PUT` | `/books/:bookId/` | Update an existing book | 200, 400, 404, 500 |
| `DELETE` | `/books/:bookId/` | Delete a book by ID | 200, 400, 404, 500 |

---

### Detailed Endpoint Specifications

#### 1. GET `/books/`
- **Method:** `GET`
- **URL:** `http://localhost:3000/books/` (or `https://<your-render-service>.onrender.com/books/`)
- **Success Status:** `200 OK`
- **Response Format:**
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
- **Method:** `GET`
- **URL:** `http://localhost:3000/books/1/`
- **Success Status:** `200 OK`
- **Response Format:**
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
  - `400 Bad Request`: `{"error": "Invalid book ID format. It must be a number."}`
  - `404 Not Found`: `{"error": "Book not found"}`

---

#### 3. POST `/books/`
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
- **Response Format:**
  ```json
  {
    "message": "Book Added Successfully",
    "bookId": 11
  }
  ```
- **Error Response:**
  - `400 Bad Request`: `{"error": "Missing required fields: title, author, price, and pages are required."}`

---

#### 4. PUT `/books/:bookId/`
- **Method:** `PUT`
- **URL:** `http://localhost:3000/books/1/`
- **Headers:** `Content-Type: application/json`
- **Request Body Example:**
  ```json
  {
    "title": "To Kill a Mockingbird (Special Edition)",
    "author": "Harper Lee",
    "price": 500,
    "pages": 281
  }
  ```
- **Success Status:** `200 OK`
- **Response Format:**
  ```json
  {
    "message": "Book Details Updated Successfully"
  }
  ```
- **Error Responses:**
  - `400 Bad Request`: When fields are missing or ID is not a number.
  - `404 Not Found`: When `bookId` does not exist.

---

#### 5. DELETE `/books/:bookId/`
- **Method:** `DELETE`
- **URL:** `http://localhost:3000/books/1/`
- **Success Status:** `200 OK`
- **Response Format:**
  ```json
  {
    "message": "Book Deleted Successfully"
  }
  ```
- **Error Responses:**
  - `400 Bad Request`: If `bookId` is not a valid number.
  - `404 Not Found`: If `bookId` does not exist in the database.

---

## Render Deployment Guide

### Why the Previous Error Occurred
The error `Error: Cannot find module '/opt/render/project/src/npm'` happens when Render's **Start Command** is incorrectly entered as `node npm start` or `node npm`. Render tries to execute a JavaScript file named `npm` via Node instead of executing the `npm` binary directly.

### Correct Settings for Render Web Service

1. Go to your [Render Dashboard](https://dashboard.render.com/) and click **New +** -> **Web Service**.
2. Connect your GitHub repository (`Jaydeep-Mallick/Lab2bdf`).
3. Fill in the deployment settings:
   - **Name:** `lab2bdf` (or your preferred name)
   - **Language / Runtime:** `Node`
   - **Region:** Choose the region closest to you (e.g., Oregon, Singapore, Frankfurt)
   - **Branch:** `main`
   - **Root Directory:** **LEAVE BLANK** *(Do NOT type `Lab2bdf`. `package.json` and `app.js` are in the root directory of the repository).*
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** `Free`
4. Click **Deploy Web Service**.

Alternatively, if you use Render Blueprints, Render will automatically detect [render.yaml](file:///Users/jaydeepmallick/Desktop/lab-02/render.yaml).

---

## SQLite Persistence on Cloud Platforms

Render's default filesystem on free web services is **ephemeral**:
- Any new records inserted via `POST /books/` or changes made via `PUT /books/:bookId/` will reside in memory/local disk during the active instance lifetime.
- When Render restarts the container (e.g. during an idle spin-down or new deployment), the filesystem resets.
- Thanks to the idempotent initialization in `app.js`, the service will automatically re-seed the initial 10 books so your endpoints never break.

### Optional: Persistent Disk Setup (Paid Render Plan)
If you require writes (new/updated books) to persist across all container redeployments:
1. In Render Web Service settings, add a **Disk**:
   - **Mount Path:** `/var/data`
   - **Size:** 1 GB
2. Add an **Environment Variable**:
   - **Key:** `DB_PATH`
   - **Value:** `/var/data/books.db`
`app.js` is already coded to read `process.env.DB_PATH` and automatically create the `/var/data` directory if needed.

---

## Testing & Verification Guide

Test all endpoints using cURL:

```bash
# 1. Test GET all books
curl -i http://localhost:3000/books/

# 2. Test GET one book
curl -i http://localhost:3000/books/1/

# 3. Test POST new book
curl -i -X POST http://localhost:3000/books/ \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Book", "author": "Test Author", "price": 250, "pages": 150}'

# 4. Test PUT update book
curl -i -X PUT http://localhost:3000/books/11/ \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Title", "author": "Test Author", "price": 300, "pages": 160}'

# 5. Test DELETE book
curl -i -X DELETE http://localhost:3000/books/11/

# 6. Test 404 error
curl -i http://localhost:3000/books/999/
```

*(Replace `http://localhost:3000` with your live Render URL like `https://<service-name>.onrender.com` once deployed).*

---

## Troubleshooting & Viva Reference

1. **Why `process.env.PORT || 3000`?**
   Cloud platforms like Render dynamically assign a port via the `PORT` environment variable (e.g., 10000). Hardcoding port 3000 will cause the cloud health check to fail.
2. **Why `db.run` vs `db.get` vs `db.all`?**
   - `db.all`: Returns all matching rows as an array of objects.
   - `db.get`: Returns the first matching row object.
   - `db.run`: Used for write operations (`INSERT`, `UPDATE`, `DELETE`, `CREATE TABLE`) and returns `lastID` and `changes`.
3. **How is SQL injection prevented?**
   All dynamic queries use `?` placeholders. Values are bound separately as literals, preventing attackers from injecting SQL statements.
