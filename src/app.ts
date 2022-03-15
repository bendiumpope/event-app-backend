import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitizer from "express-mongo-sanitize";

import eventRoutes from "./routes/eventRoutes";
import userRoutes from "./routes/userRoutes";
import HttpError from "./utils/http-error";

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(helmet());

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many request from this IP, Please try again in an hour!",
});

app.use("/api", limiter);

app.use(express.json({ limit: "10kb" }));

app.use(mongoSanitizer());

app.use((req: any, res: Response, next: NextFunction) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use(cors());

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/events", eventRoutes);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const error = new HttpError(
    `Cant find ${req.originalUrl} on this server!`,
    404
  );

  throw error;
});

app.use((error: any, req: Request, res: any, next: NextFunction) => {
  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500).json({
    message: error.message || "An unknown error occured",
  });
});

export default app;
