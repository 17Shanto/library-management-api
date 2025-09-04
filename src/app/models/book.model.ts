import mongoose, { Schema } from "mongoose";
import { IBook } from "../interfaces/book.interface";

const bookSchema = new Schema<IBook>({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: {
    type: String,
    enum: [
      "FICTION",
      "NON_FICTION",
      "SCIENCE",
      "HISTORY",
      "BIOGRAPHY",
      "FANTASY",
    ],
  },
  isbn: { type: String, required: true, unique: true },
  description: { type: String, required: false },
  copies: { type: Number, required: true },
  available: { type: Boolean, default: true },
});

export const Book = mongoose.model("Book", bookSchema);
