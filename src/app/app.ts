import express, { Request, Response } from "express";
import { errorHandler } from "./middlewares/errorHandler";
import { booksRoutes } from "./controllers/book.controllers";
export const app = express();
app.use(express.json());

// Controllers
app.use("/api/books", booksRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to lms app");
});

app.use(errorHandler);
