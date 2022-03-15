import express from "express";
import { protect } from "../middlewares/auth-middleware";
import {
  getEvents,
  createEvent,
  getEvent,
} from "../controllers/eventControllers";
import User from "../models/user";
import eventValidator from "../utils/validator/eventValidator";

const router = express.Router();

router.get("/", getEvents);

router.post("/", eventValidator, protect(User), createEvent);

router.get("/:id", protect(User), getEvent);

export default router;
