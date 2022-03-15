import { Request, Response, NextFunction } from "express";
import HttpError from "../utils/http-error";
import { decodeToken } from "../utils/token/authToken";

//protecting route using a middleware function
export const protect = (Model) => {
  return async (req: any, res: Response, next: NextFunction) => {
    try {
      if (req.method === "OPTIONS") {
        return next();
      }
      let token;
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      ) {
        token = req.headers.authorization.split(" ")[1];
      }

      if (!token) {
        return next(
          new HttpError(
            "You are not logged in! Please log in to get access",
            401
          )
        );
      }
      const decoded: any = decodeToken(token);

      const currentUser = await Model.findById(decoded._doc._id);

      if (!currentUser) {
        return next(
          new HttpError(
            "The user belongging to this token no longer exists",
            401
          )
        );
      }

      //Grant access to protected route
      req.user = currentUser;

      next();
    } catch (error: any) {
      //   console.log(error);
      return next(new HttpError("Authentication failed!", 403));
    }
  };
};
