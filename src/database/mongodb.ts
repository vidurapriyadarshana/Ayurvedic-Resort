import mongoose from "mongoose";
import { DB_URI, NODE_ENV } from "../config/env";

// This runtime check is excellent and remains unchanged.
if (!DB_URI) {
  throw new Error("Database URI is not defined in environment variables");
}

/**
 * Connects to the MongoDB database using the URI from environment variables.
 * Exits the process if the connection fails.
 */
const connectToDatabase = async (): Promise<void> => {
  try {
    // The connect function returns a promise. We await it as before.
    await mongoose.connect(DB_URI as string);
    console.log(`Connected to MongoDB database in ${NODE_ENV || 'development'} mode`);
  } catch (error) {
    console.error("Failed to connect to the database");

    // Use 'unknown' for better type safety in catch blocks
    // and check if it's an Error instance before accessing .message
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      // Log the error itself if it's not an Error object
      console.error(error);
    }

    // Exit the application process on a fatal database connection error
    process.exit(1);
  }
};

export default connectToDatabase;
