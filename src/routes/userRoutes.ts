// import _ from 'lodash';
import express, { Request, Response } from "express";
import User from "../models/user";
import { getUsers, login, createUser } from "../controllers/userControllers";
import { protect } from "../middlewares/auth-middleware";
import userValidator from "../utils/validator/userValidator";
import loginValidator from "../utils/validator/loginValidator";

const router = express.Router();

router.get("/", protect(User), getUsers);

router.post("/", userValidator, protect(User), createUser);
router.post("/login", loginValidator, login);

export default router;
