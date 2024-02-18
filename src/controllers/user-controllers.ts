import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import { hash, compare } from "bcrypt";
import { createToken } from "../utils/token-manager";
import { COOKIE_NAME } from "../utils/constants";

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find();
    return res.status(200).json({
      success: true,
      message: "Fetching all users successfully",
      users,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const userSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(401).send("User already registered");

    const hashedPassword = await hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    // create token and store cookie
    res.clearCookie(COOKIE_NAME, {
      path: "/",
      httpOnly: true,
      domain: "localhost",
      signed: true,
    });

    const token = createToken(user._id.toString(), user.email, "7d");

    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    res.cookie(COOKIE_NAME, token, {
      path: "/",
      domain: "localhost",
      expires,
      httpOnly: true,
      signed: true,
    });

    return res.status(201).json({
      success: true,
      message: "user created successfully",
      id: user._id.toString(),
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const userLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not registered",
      });
    }

    const isPasswordCorrect = await compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(403).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    res.clearCookie(COOKIE_NAME, {
      path: "/",
      httpOnly: true,
      domain: "localhost",
      signed: true,
    });

    const token = createToken(user._id.toString(), user.email, "7d");
    // after generating token, we will send token in the form of cookies
    // cookie-parser is used to send cookies from backend to frontend
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    res.cookie(COOKIE_NAME, token, {
      path: "/",
      domain: "localhost",
      expires,
      httpOnly: true,
      signed: true,
    }); // now cookie will be created inside browser
    // after crating this cookie, once the user logs in, we want to remove the cookies of the user as well, suppose user logs in again, we will remove the previous cookie and set the current cookie

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      id: user._id.toString(),
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
