import express, { Request, Response, NextFunction } from "express";
import { protect } from "../middlewares/auth-middleware";
import Event from "../models/event";
import HttpError from "../utils/http-error";

const router = express.Router();

export const getEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const events = await Event.find();

    if (events.length < 1) {
      return res.status(200).json({ message: "No event found", data: events });
    }

    res.status(200).json({
      message: "success",
      data: events,
    });
  } catch (error) {
    return next(
      new HttpError("An error occured, getting events failed......", 500)
    );
  }
};

export const createEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let event = new Event({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      isVirtual: req.body.isVirtual,
      date: req.body.date,
      address: req.body.address,
    });
    event = await event.save();

    res.status(200).json({
      message: "success",
      data: event,
    });
  } catch (error) {
    return next(
      new HttpError(`An error occured, Creating event failed......`, 500)
    );
  }
};

export const getEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return next(
        new HttpError(`The event with the given ID was not found.`, 422)
      );
    }

    res.status(201).json({
      message: "success",
      data: event,
    });
  } catch (error) {
    return next(
      new HttpError(`An error occured, Creating event failed......`, 500)
    );
  }
};

export default router;
