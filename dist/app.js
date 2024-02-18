"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const user_routes_1 = __importDefault(require("./routes/user-routes"));
const chat_routes_1 = __importDefault(require("./routes/chat-routes"));
(0, dotenv_1.config)();
const app = (0, express_1.default)();
// middlewares
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)(process.env.COOKIE_SECRET));
app.use((0, morgan_1.default)("dev"));
app.use("/api/v1/user", user_routes_1.default);
app.use("/api/v1/chat", chat_routes_1.default);
app.get("/", (req, res, next) => {
    res.send("Welcome!");
});
exports.default = app;
