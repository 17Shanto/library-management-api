import express, { Request, Response } from "express";
import { errorHandler } from "./middlewares/errorHandler";
export const app = express();
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to lms app");
});

app.use(errorHandler);
