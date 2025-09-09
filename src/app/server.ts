import { Server } from "http";
import { app } from "./app";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

let server: Server;
const PORT = Number(process.env.PORT) || 5000;
const MONGODB_URL = process.env.MONGODB_URL as string;

async function main() {
  try {
    await mongoose.connect(`${MONGODB_URL}`);
    console.log("Database mongodb has been connected");
    server = app.listen(PORT, () => {
      console.log(`App is listening on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}
main();
