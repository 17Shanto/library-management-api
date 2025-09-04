import { Server } from "http";
import { app } from "./app";

let server: Server;
const PORT = 500;

async function main() {
  try {
    server = app.listen(PORT, () => {
      console.log(`App is listening on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}
main();
