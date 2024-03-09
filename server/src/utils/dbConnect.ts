import mongoose from 'mongoose';

// Function to connect to MongoDB Atlas
export default async () => {
    const url = process.env.MONGO_URI; // MongoDB Atlas connection URI from environment variables
    try {
        // Attempt to connect to the MongoDB Atlas database
        await mongoose.connect(url!);
        console.log(`MongoDB connected: ${mongoose.connection.host}:${mongoose.connection.port}`); // Log successful connection
    } catch (error) {
        // Log and exit the process if connection fails
        console.log("Connection error:", (error as Error).message);
        process.exit(1);
    }
}
