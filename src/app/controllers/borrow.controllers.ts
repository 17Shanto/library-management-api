import express, { NextFunction, Request, Response } from "express";
import { Borrow } from "./../models/borrow.model";
export const borrowRoutes = express.Router();

borrowRoutes.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body;
      const bookId = body.book;
      const quantity = body.quantity;
      const isAvailable = await Borrow.isBookAvailable(bookId, quantity);
      if (!isAvailable) {
        const err: any = new Error("Book is not found or not available");
        err.name = "NotFoundError";
        err.statusCode = 404;
        throw err;
      } else {
        const data = await Borrow.create(body);
        res.status(201).send({
          success: true,
          message: "Book borrowed successfully",
          data: data,
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

borrowRoutes.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const summary = await Borrow.aggregate([
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
        const err: any = new Error("Borrow list not found");
        err.name = "NotFoundError";
        err.statusCode = 404;
        throw err;
      }

      res.json({
        success: true,
        message: "Borrowed books summary retrieved successfully",
        data: summary,
      });
    } catch (error) {
      next(error);
    }
  }
);
