import mongoose, { Schema } from "mongoose";
import { IBook } from "../interfaces/book.interface";
import { Borrow } from "./borrow.model";

const bookSchema = new Schema<IBook>(
  {
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
    copies: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: "{VALUE} is not an integer value",
      },
    },
    available: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

bookSchema.pre("save", async function (next) {
  this.title = (await this.title.trim()) as string;
  this.author = (await this.author.trim()) as string;
  next();
});

bookSchema.post("findOneAndDelete", async function (doc, next) {
  if (doc) {
    await Borrow.deleteMany({ book: doc._id });
  }
  next();
});

export const Book = mongoose.model<IBook>("Book", bookSchema);
