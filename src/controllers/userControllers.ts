import express, { Request, Response, NextFunction } from "express";
import User from "../models/user";
import bcrypt from "bcrypt";
import HttpError from "../utils/http-error";
import { generateToken } from "../utils/token/authToken";

export const getUsers = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = await User.find();

    if (user.length < 1) {
      return res.status(200).json({ message: "No user found", data: user });
    }

    res.status(200).json({
      message: "success",
      data: user,
    });
  } catch (error) {
    return next(
      new HttpError("An error occured, getting user failed......", 500)
    );
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const isEmailUnique = await User.findOne({ email: req.body.email });

    console.log("isEmailUnique....:", isEmailUnique);

    if (isEmailUnique) {
      return next(
        new HttpError(`User with this ${req.body.email} already exists`, 422)
      );
    }

    const passwordHash = await bcrypt.hash(req.body.password, 8);
    req.body.password = passwordHash;

    const newUser = await new User(req.body);
    await newUser.save();

    res.status(201).json({
      message: "success",
      data: newUser,
    });
  } catch (error) {
    return next(
      new HttpError(`An error occured, Creating user failed......`, 500)
    );
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return next(new HttpError("Invalid credentials", 401));
    }

    const validatePassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validatePassword) {
      return next(new HttpError("Invalid credentials", 401));
    }

    console.log(".... ", validatePassword);
    const token = generateToken(user);

    req.headers.authorization = `Bearer ${token}`;

    res.status(200).json({
      message: "success",
      data: token,
    });
  } catch (error) {
    return next(
      new HttpError("An error occured, Login user failed.......", 500)
    );
  }
};
