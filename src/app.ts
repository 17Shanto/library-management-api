import express, { Request, Response } from "express";
import { booksRoutes } from "./app/controllers/book.controllers";
import { borrowRoutes } from "./app/controllers/borrow.controllers";
import { errorHandler } from "./app/middlewares/errorHandler";

export const app = express();
app.use(express.json());

// Controllers
app.use("/api/books", booksRoutes);
app.use("/api/borrow", borrowRoutes);
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to lms app");
});

app.use(errorHandler);
