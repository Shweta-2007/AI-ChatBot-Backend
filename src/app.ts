import express from "express";
import { config } from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user-routes";
import chatRoutes from "./routes/chat-routes";

config();

const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(morgan("dev"));

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/chat", chatRoutes);

app.get("/", (req, res, next) => {
  res.send("Welcome!");
});
export default app;
