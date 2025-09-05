import express, { NextFunction, Request, Response } from "express";
import { Book } from "../models/book.model";
export const booksRoutes = express.Router();

booksRoutes.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const book = await Book.create(data);
      res.status(201).send({
        success: true,
        message: "Book created successfully",
        data: book,
      });
    } catch (error) {
      next(error);
    }
  }
);

booksRoutes.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    type SortOrder = "asc" | "desc";
    const ALLOWED_GENRES = [
      "FICTION",
      "NON_FICTION",
      "SCIENCE",
      "HISTORY",
      "BIOGRAPHY",
      "FANTASY",
    ] as const;
    const ALLOWED_SORT_FIELDS = [
      "createdAt",
      "updatedAt",
      "title",
      "author",
      "isbn",
      "copies",
    ] as const;

    try {
      const {
        filter,
        sortBy = "createdAt",
        sort = "desc",
        limit = "10",
      } = req.query;

      if (filter && !ALLOWED_GENRES.includes(filter as any)) {
        const err: any = new Error(`Invalid genre filter: ${filter}`);
        err.name = "BadRequestError";
        err.statusCode = 400;
        throw err;
      }

      if (!ALLOWED_SORT_FIELDS.includes(sortBy as any)) {
        const err: any = new Error(`Invalid sortBy: ${sortBy}`);
        err.name = "BadRequestError";
        err.statusCode = 400;
        throw err;
      }

      if (sort !== "asc" && sort !== "desc") {
        const err: any = new Error(
          `Invalid sort order: ${sort} (use "asc" or "desc")`
        );
        err.name = "BadRequestError";
        err.statusCode = 400;
        throw err;
      }

      const parsedLimit = Number(limit);
      if (!Number.isInteger(parsedLimit) || parsedLimit <= 0) {
        const err: any = new Error(
          `Invalid limit: ${limit} (must be a positive integer)`
        );
        err.name = "BadRequestError";
        err.statusCode = 400;
        throw err;
      }

      const mongoFilter = filter ? { genre: filter } : {};
      const sortObj: Record<string, 1 | -1> = {
        [String(sortBy)]: sort === "asc" ? 1 : -1,
      };

      const books = await Book.find(mongoFilter)
        .sort(sortObj)
        .limit(parsedLimit)
        .lean();

      res.json({
        success: true,
        message: "Books retrieved successfully",
        data: books,
      });
    } catch (error) {
      next(error);
    }
  }
);

booksRoutes.get(
  "/:bookId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bookId = req.params.bookId;
      const book = await Book.findById(bookId);
      if (!book) {
        const err: any = new Error("Book not found");
        err.name = "NotFoundError";
        err.statusCode = 404;
        throw err;
      }
      res.status(200).send({
        success: true,
        message: "Book retrieved successfully",
        data: book,
      });
    } catch (error) {
      next(error);
    }
  }
);

booksRoutes.patch(
  "/:bookId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bookId = req.params.bookId;
      const updatedBody = req.body;
      const updatedBook = await Book.findByIdAndUpdate(bookId, updatedBody, {
        new: true,
      });
      if (!updatedBook) {
        const err: any = new Error("Book not found");
        err.name = "NotFoundError";
        err.statusCode = 404;
        throw err;
      }
      res.status(200).send({
        success: true,
        message: "Book updated successfully",
        data: updatedBook,
      });
    } catch (error) {
      next(error);
    }
  }
);

booksRoutes.delete(
  "/:bookId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bookId = req.params.bookId;
      const deletedBook = await Book.findByIdAndDelete(bookId);
      if (!deletedBook) {
        const err: any = new Error("Book not found");
        err.name = "NotFoundError";
        err.statusCode = 404;
        throw err;
      }
      res.status(200).send({
        success: true,
        message: "Book deleted successfully",
        data: null,
      });
    } catch (error) {
      next(error);
    }
  }
);
