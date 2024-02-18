"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userLogin = exports.userSignup = exports.getAllUsers = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcrypt_1 = require("bcrypt");
const token_manager_1 = require("../utils/token-manager");
const constants_1 = require("../utils/constants");
const getAllUsers = async (req, res, next) => {
    try {
        const users = await User_1.default.find();
        return res.status(200).json({
            success: true,
            message: "Fetching all users successfully",
            users,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
exports.getAllUsers = getAllUsers;
const userSignup = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser)
            return res.status(401).send("User already registered");
        const hashedPassword = await (0, bcrypt_1.hash)(password, 10);
        const user = new User_1.default({ name, email, password: hashedPassword });
        await user.save();
        // create token and store cookie
        res.clearCookie(constants_1.COOKIE_NAME, {
            path: "/",
            httpOnly: true,
            domain: "localhost",
            signed: true,
        });
        const token = (0, token_manager_1.createToken)(user._id.toString(), user.email, "7d");
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        res.cookie(constants_1.COOKIE_NAME, token, {
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
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
exports.userSignup = userSignup;
const userLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not registered",
            });
        }
        const isPasswordCorrect = await (0, bcrypt_1.compare)(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(403).json({
                success: false,
                message: "Invalid credentials",
            });
        }
        res.clearCookie(constants_1.COOKIE_NAME, {
            path: "/",
            httpOnly: true,
            domain: "localhost",
            signed: true,
        });
        const token = (0, token_manager_1.createToken)(user._id.toString(), user.email, "7d");
        // after generating token, we will send token in the form of cookies
        // cookie-parser is used to send cookies from backend to frontend
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        res.cookie(constants_1.COOKIE_NAME, token, {
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
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
exports.userLogin = userLogin;
