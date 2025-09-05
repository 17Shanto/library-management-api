import { Server } from "http";
import { app } from "./app";
import mongoose from "mongoose";

let server: Server;
const PORT = 5000;

async function main() {
  try {
    await mongoose.connect(
      "mongodb+srv://shahporanshanto23:gDuSbBDKNuF6T9Ig@note-app-cluster.aff1yy7.mongodb.net/library-management-api?retryWrites=true&w=majority&appName=note-app-cluster"
    );
    console.log("Database mongodb has been connected");
    server = app.listen(PORT, () => {
      console.log(`App is listening on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}
main();
