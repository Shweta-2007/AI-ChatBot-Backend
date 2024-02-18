"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectFromDatabase = exports.connectToDatabase = void 0;
const mongoose_1 = require("mongoose");
async function connectToDatabase() {
    try {
        await (0, mongoose_1.connect)(process.env.MONGODB_URI);
        console.log("DB Connected");
    }
    catch (error) {
        console.log(error);
        throw new Error("Can not connect to MongoDB");
    }
}
exports.connectToDatabase = connectToDatabase;
async function disconnectFromDatabase() {
    try {
        await (0, mongoose_1.disconnect)();
    }
    catch (error) {
        console.log(error);
        throw new Error("Could not disConnect from MongoDB");
    }
}
exports.disconnectFromDatabase = disconnectFromDatabase;
