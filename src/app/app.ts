import express, { Request, Response } from "express";
export const app = express();
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to lms app");
});
