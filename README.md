# Library Management API (Express + Mongoose, TypeScript)

A small REST API for managing books and borrowing records. Built with Express 5, Mongoose 8, and TypeScript.

---

## Features

- **Books CRUD**
  - Create, read, update, and delete books.
  - Fields: title, author, genre (FICTION, NON_FICTION, SCIENCE, HISTORY, BIOGRAPHY, FANTASY), isbn, description, copies, available.

- **Borrow workflow**
  - Create borrow records with book, quantity, and dueDate.
  - Stock checks before borrowing (fails if book is missing or not enough copies).
  - Copies are reduced on borrow; restored on delete/update as implemented in the model logic.

- **Linked data**
  - Borrow.book references Book by ObjectId with population support.
  - When a book is deleted, related borrow entries are cleaned up by a Mongoose middleware (hook).

- **Query helpers on books**
  - Filter by genre.
  - Sort by allowed fields (e.g., createdAt, title, etc. as defined in controller).
  - Limit results with limit query param.

- **Consistent error handling**
  - Central error handler returns JSON with success, message, and error.
  - Uses custom errors for ValidationError, BadRequestError, and NotFoundError.

- **TypeScript-first**
  - Strong types for models and request bodies via interfaces.

- **Ready for Docker/Cloud**
  - Single env var for MongoDB connection; stateless API.

> Note: The repo includes a sample connection string in server.ts. Do not commit real credentials. Use environment variables as shown below.

---

## Tech Stack

- Runtime: Node.js
- Framework: Express 5
- Database: MongoDB (Mongoose 8)
- Language: TypeScript
- Dev tools: ts-node-dev

---

## Project Structure

```
src/
  app/
    app.ts                 # Express app (routes, JSON parsing, error handler)
    server.ts              # DB connect + server bootstrap
    controllers/
      book.controllers.ts  # /api/books endpoints
      borrow.controllers.ts# /api/borrow endpoints
    models/
      book.model.ts        # Book schema + hooks
      borrow.model.ts      # Borrow schema + static methods (stock checks)
    interfaces/
      book.interface.ts
      borrow.interface.ts
      error.interface.ts
    middlewares/
      errorHandler.ts
tsconfig.json
package.json
```

---

## Getting Started

### 1. Prerequisites
- Node.js 18+
- MongoDB Atlas or local MongoDB

### 2. Install
```bash
npm install
```

### 3. Configure environment
Create a `.env` file (or use your process manager to inject vars):

```env
PORT = 5000
MONGODB_URL = "mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority"
```

Update `src/app/server.ts` to read from env:
```ts
const PORT = Number(process.env.PORT) || 5000;
const MONGODB_URL = process.env.MONGODB_URL as string;
```

*(If you prefer, you can keep the constants but you should not ship secrets.)*

### 4. Run in dev
```bash
npm run dev
```

The API will listen on [http://localhost:5000](http://localhost:5000).

---

## API Reference

**Base URL:** `/api`

### Books

#### Create a book
**POST** `/api/books`  

**Body**
```json
{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "genre": "NON_FICTION",
  "isbn": "9780132350884",
  "description": "A handbook of agile software craftsmanship.",
  "copies": 5,
  "available": true
}
```

**Response 201**
```json
{
  "success": true,
  "message": "Book created successfully",
  "data": { "...": "book document" }
}
```

---

#### List books (filter, sort, limit)
**GET** `/api/books?filter=SCIENCE&sortBy=title&sort=asc&limit=10`  

- `filter` — one of the allowed genre values.  
- `sortBy` — allowed fields only (validated in controller).  
- `sort` — asc or desc.  
- `limit` — positive integer.  

**Response 200**
```json
{
  "success": true,
  "message": "Books retrieved successfully",
  "data": [ { "...": "book" } ]
}
```

---

#### Get a book by id
**GET** `/api/books/:bookId`  

**Response 200**
```json
{
  "success": true,
  "message": "Book retrieved successfully",
  "data": { "...": "book document" }
}
```

**Errors**
- 404 if not found.

---

#### Update a book
**PATCH** `/api/books/:bookId`  

**Body (partial)**
```json
{
  "title": "Clean Code (2nd Edition)",
  "copies": 7
}
```

**Response 200**
```json
{
  "success": true,
  "message": "Book updated successfully",
  "data": { "...": "updated book" }
}
```

---

#### Delete a book
**DELETE** `/api/books/:bookId`  

- Triggers a post findOneAndDelete hook that removes related borrow records.

**Response 200**
```json
{
  "success": true,
  "message": "Book deleted successfully",
  "data": null
}
```

---

### Borrow

#### Create a borrow record
**POST** `/api/borrow`  

**Body**
```json
{
  "book": "66e0b8a8a6e6a3c2d5a7f9b1",
  "quantity": 2,
  "dueDate": "2025-09-30T00:00:00.000Z"
}
```

- Checks if the book exists and if copies is enough.  
- Updates the book’s copies count on success.  

**Response 201**
```json
{
  "success": true,
  "message": "Book borrowed successfully",
  "data": { "...": "borrow document" }
}
```

**Errors**
- 404 with message `"Book is not found or not available"` if stock missing.

---

**Common admin endpoints**  
Depending on your version of the controller, the API typically includes:

- `GET /api/borrow` — list borrow records.  
- `GET /api/borrow/:id` — single borrow record with populated book.  
- `DELETE /api/borrow/:id` — delete a borrow record and adjust copies.  
- `GET /api/borrow/summary` — summary of borrowed books.  

Review `src/app/controllers/borrow.controllers.ts` in your repo for the exact routes and query params. The error messages and shapes follow the same pattern as books.

---

## Error Format

All errors pass through the central handler:
```json
{
  "message": "Validation failed",
  "success": false,
  "error": { "...": "details" }
}
```

- Mongoose `ValidationError` maps to `"Validation failed"`.  
- Missing resources use `NotFoundError`.  
- Bad input uses `BadRequestError`.  

---

## Example cURL

Create a book:
```bash
curl -X POST http://localhost:5000/api/books   -H "Content-Type: application/json"   -d '{
    "title":"Clean Code",
    "author":"Robert C. Martin",
    "genre":"NON_FICTION",
    "isbn":"9780132350884",
    "description":"A handbook of agile software craftsmanship.",
    "copies":5,
    "available":true
  }'
```

Borrow a book:
```bash
curl -X POST http://localhost:5000/api/borrow   -H "Content-Type: application/json"   -d '{
    "book":"<book_object_id>",
    "quantity":1,
    "dueDate":"2025-09-30T00:00:00.000Z"
  }'
```

---

## Scripts

- `npm run dev` — start the server with ts-node-dev (watch mode).

---

## Environment & Config

- `PORT` — HTTP port (default 5000).  
- `MONGODB_URI` — MongoDB connection string.  

---

## Notes and Tips

- Keep `available` in sync with `copies` in your service layer if you expose that flag.  
- Add request validation (e.g., zod or express-validator) for stronger checks on payloads.  
- Add auth (JWT or session) if you plan to expose this API beyond local use.  
- Add indexes on `isbn` and common search fields if you expect growth.  
- Add tests for:  
  - Borrow stock checks.  
  - Cascade delete behavior when a book is removed.  
  - Query params (filter, sortBy, sort, limit).  

---

## License

ISC (see package.json)
