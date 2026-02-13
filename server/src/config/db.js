import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  try {
    const uri =
      process.env.MONGODB_URI || "mongodb://localhost:27017/lead-intel";
    
    const options = {
      maxPoolSize: 10,
      minPoolSize: 2,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 5000,
      family: 4, // Use IPv4
    };

    const conn = await mongoose.connect(uri, options);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);

    // Connection event handlers
    mongoose.connection.on("connected", () => {
      console.log("Mongoose connected to MongoDB");
    });

    mongoose.connection.on("error", (err) => {
      console.error(`Mongoose connection error: ${err}`);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("Mongoose disconnected from MongoDB");
    });

    return conn;
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    // In production, you might want to exit the process
    if (process.env.NODE_ENV === "production") {
      console.error("Fatal: Cannot connect to database. Exiting...");
      process.exit(1);
    } else {
      console.warn("Running without database — using in-memory fallback");
    }
  }
};

export default connectDB;
