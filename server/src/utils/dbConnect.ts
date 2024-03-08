import mongoose from 'mongoose';

export default async () => {
    const url = process.env.MONGOOSE_ID;
    try {
        await mongoose.connect(url!)
        console.log(`mongodb connected ${mongoose.connection.host} : ${mongoose.connection.port}`)
    } catch (error) {
        console.log("connection error", (error as Error).message)
        process.exit(1);
    }

}