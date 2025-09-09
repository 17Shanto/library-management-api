import express, { Request, Response } from "express";
import { errorHandler } from "./middlewares/errorHandler";
import { booksRoutes } from "./controllers/book.controllers";
import { borrowRoutes } from "./controllers/borrow.controllers";
export const app = express();
app.use(express.json());

// Controllers
app.use("/api/books", booksRoutes);
app.use("/api/borrow", borrowRoutes);
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to lms app");
});

app.use(errorHandler);
