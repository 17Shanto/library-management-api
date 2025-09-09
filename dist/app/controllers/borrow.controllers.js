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
exports.borrowRoutes = void 0;
const express_1 = __importDefault(require("express"));
const borrow_model_1 = require("./../models/borrow.model");
exports.borrowRoutes = express_1.default.Router();
exports.borrowRoutes.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const bookId = body.book;
        const quantity = body.quantity;
        const isAvailable = yield borrow_model_1.Borrow.isBookAvailable(bookId, quantity);
        if (!isAvailable) {
            const err = new Error("Book is not found or not available");
            err.name = "NotFoundError";
            err.statusCode = 404;
            throw err;
        }
        else {
            const data = yield borrow_model_1.Borrow.create(body);
            res.status(201).send({
                success: true,
                message: "Book borrowed successfully",
                data: data,
            });
        }
    }
    catch (error) {
        next(error);
    }
}));
exports.borrowRoutes.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const summary = yield borrow_model_1.Borrow.aggregate([
            {
                $group: {
                    _id: "$book",
                    totalQuantity: { $sum: "$quantity" },
                },
            },
            {
                $lookup: {
                    from: "books",
                    localField: "_id",
                    foreignField: "_id",
                    as: "book",
                },
            },
            { $unwind: "$book" },
            {
                $project: {
                    _id: 0,
                    book: { title: "$book.title", isbn: "$book.isbn" },
                    totalQuantity: 1,
                },
            },
        ]);
        if (!summary.length) {
            const err = new Error("Borrow list not found");
            err.name = "NotFoundError";
            err.statusCode = 404;
            throw err;
        }
        res.json({
            success: true,
            message: "Borrowed books summary retrieved successfully",
            data: summary,
        });
    }
    catch (error) {
        next(error);
    }
}));
