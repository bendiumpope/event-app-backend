import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import HttpError from "../http-error";

function loginValidator(req: Request, res: Response, next: NextFunction) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return next(new HttpError(error.details[0].message, 400));
  }

  return next();
}

export default loginValidator;
