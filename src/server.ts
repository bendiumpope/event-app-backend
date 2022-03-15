import mongoose from "mongoose";
import dotenv from "dotenv";

import app from "./app";

dotenv.config();
///Handling Unhandled Uncaught Exception (synchronous error)
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTIONS ......Shutting down.");
  // console.log(err.name, err.message);
  console.log(err);
  process.exit(1);
});

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then((con) => console.log("DB Connected Successfully"));

const port = process.env.PORT || 3001;
const server = app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

///Handling Unhandled Promise Rejection
process.on("unhandledRejection", (err: Error) => {
  console.log("UNHANDLED REJECTION ......Shutting down.");
  console.log(err);
  console.log(err.name, err.message);
  // console.log(err.stack)

  server.close(() => {
    process.exit(1);
  });
});
