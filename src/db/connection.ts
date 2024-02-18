import { connect, disconnect } from "mongoose";

async function connectToDatabase() {
  try {
    await connect(process.env.MONGODB_URI);
    console.log("DB Connected");
  } catch (error) {
    console.log(error);
    throw new Error("Can not connect to MongoDB");
  }
}

async function disconnectFromDatabase() {
  try {
    await disconnect();
  } catch (error) {
    console.log(error);
    throw new Error("Could not disConnect from MongoDB");
  }
}

export { connectToDatabase, disconnectFromDatabase };
