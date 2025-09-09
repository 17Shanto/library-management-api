"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.booksRoutes = void 0;
const express_1 = __importDefault(require("express"));
const book_model_1 = require("../models/book.model");
exports.booksRoutes = express_1.default.Router();
exports.booksRoutes.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const book = yield book_model_1.Book.create(data);
        res.status(201).send({
            success: true,
            message: "Book created successfully",
            data: book,
        });
    }
    catch (error) {
        next(error);
    }
}));
exports.booksRoutes.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const ALLOWED_GENRES = [
        "FICTION",
        "NON_FICTION",
        "SCIENCE",
        "HISTORY",
        "BIOGRAPHY",
        "FANTASY",
    ];
    const ALLOWED_SORT_FIELDS = [
        "createdAt",
        "updatedAt",
        "title",
        "author",
        "isbn",
        "copies",
    ];
    try {
        const { filter, sortBy = "createdAt", sort = "desc", limit = "10", } = req.query;
        if (filter && !ALLOWED_GENRES.includes(filter)) {
            const err = new Error(`Invalid genre filter: ${filter}`);
            err.name = "BadRequestError";
            err.statusCode = 400;
            throw err;
        }
        if (!ALLOWED_SORT_FIELDS.includes(sortBy)) {
            const err = new Error(`Invalid sortBy: ${sortBy}`);
            err.name = "BadRequestError";
            err.statusCode = 400;
            throw err;
        }
        if (sort !== "asc" && sort !== "desc") {
            const err = new Error(`Invalid sort order: ${sort} (use "asc" or "desc")`);
            err.name = "BadRequestError";
            err.statusCode = 400;
            throw err;
        }
        const parsedLimit = Number(limit);
        if (!Number.isInteger(parsedLimit) || parsedLimit <= 0) {
            const err = new Error(`Invalid limit: ${limit} (must be a positive integer)`);
            err.name = "BadRequestError";
            err.statusCode = 400;
            throw err;
        }
        const mongoFilter = filter ? { genre: filter } : {};
        const sortObj = {
            [String(sortBy)]: sort === "asc" ? 1 : -1,
        };
        const books = yield book_model_1.Book.find(mongoFilter)
            .sort(sortObj)
            .limit(parsedLimit)
            .lean();
        res.json({
            success: true,
            message: "Books retrieved successfully",
            data: books,
        });
    }
    catch (error) {
        next(error);
    }
}));
exports.booksRoutes.get("/:bookId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        const book = yield book_model_1.Book.findById(bookId);
        if (!book) {
            const err = new Error("Book not found");
            err.name = "NotFoundError";
            err.statusCode = 404;
            throw err;
        }
        res.status(200).send({
            success: true,
            message: "Book retrieved successfully",
            data: book,
        });
    }
    catch (error) {
        next(error);
    }
}));
exports.booksRoutes.patch("/:bookId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        const updatedBody = req.body;
        if ((updatedBody === null || updatedBody === void 0 ? void 0 : updatedBody.copies) && (updatedBody === null || updatedBody === void 0 ? void 0 : updatedBody.copies) > 0) {
            updatedBody.available = true;
        }
        const updatedBook = yield book_model_1.Book.findByIdAndUpdate(bookId, updatedBody, {
            new: true,
        });
        if (!updatedBook) {
            const err = new Error("Book not found");
            err.name = "NotFoundError";
            err.statusCode = 404;
            throw err;
        }
        res.status(200).send({
            success: true,
            message: "Book updated successfully",
            data: updatedBook,
        });
    }
    catch (error) {
        next(error);
    }
}));
exports.booksRoutes.delete("/:bookId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        const deletedBook = yield book_model_1.Book.findByIdAndDelete(bookId);
        if (!deletedBook) {
            const err = new Error("Book not found");
            err.name = "NotFoundError";
            err.statusCode = 404;
            throw err;
        }
        res.status(200).send({
            success: true,
            message: "Book deleted successfully",
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
}));
