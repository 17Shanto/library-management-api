import mongoose, { Schema } from "mongoose";
import { IBorrow } from "../interfaces/borrow.interface";

const borrowSchema = new Schema<IBorrow>(
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

export const Borrow = mongoose.model("Borrow", borrowSchema);
