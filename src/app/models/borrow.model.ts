import mongoose, { Schema } from "mongoose";
import { BorrowStaticMethod, IBorrow } from "../interfaces/borrow.interface";
import { Book } from "./book.model";
import { IBook } from "../interfaces/book.interface";

const borrowSchema = new Schema<IBorrow, BorrowStaticMethod>(
  {
    book: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    quantity: {
      type: Number,
      min: 1,
      validate: {
        validator: Number.isInteger,
        message: "{VALUE} is not an integer number",
      },
      required: true,
    },
    dueDate: { type: Date, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Borrow = mongoose.model<IBorrow, BorrowStaticMethod>(
  "Borrow",
  borrowSchema
);

borrowSchema.static("isBookAvailable", async function (bookId: string) {
  const book = await Book.findById(bookId);
  if (book?.available) {
    const newCopies = book.copies - 1;
    if (newCopies === 0) {
      await Book.findByIdAndUpdate(bookId, { copies: 0, available: false });
    } else {
      await Book.findByIdAndUpdate(bookId, { copies: newCopies });
    }
    return true;
  } else {
    return false;
  }
});
