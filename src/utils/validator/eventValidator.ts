import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import HttpError from "../http-error";

function eventValidator(req: Request, res: Response, next: NextFunction) {
  const schema = Joi.object({
    title: Joi.string().min(5).max(50).required(),
    description: Joi.string().required(),
    category: Joi.string().required(),
    isVirtual: Joi.boolean().required(),
    date: Joi.date().required(),
    address: Joi.string().min(5).max(50).required(),
  });
  const { error } = schema.validate(req.body);

  if (error) {
    return next(new HttpError(error.details[0].message, 400));
  }

  return next();
}

export default eventValidator;
