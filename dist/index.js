"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const connection_1 = require("./db/connection");
const PORT = process.env.PORT || 4000;
(0, connection_1.connectToDatabase)()
    .then(() => {
    app_1.default.listen(PORT, () => {
        console.log("Server is running at 4000");
    });
})
    .catch((err) => console.log(err));
