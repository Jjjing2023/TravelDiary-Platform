import { MongoClient } from 'mongodb';
import dotenv from "dotenv";
dotenv.config();
const MONGO_URI = `mongodb+srv://admin:${process.env.MONGODB_PASSWAOORD}@cluster0.7btz9vt.mongodb.net/?retryWrites=true&w=majority`;
export const client = new MongoClient(MONGO_URI);
export const connectDB = async () => {
    await client.connect();
    return client.db('travelDiary');  // replace 'YOUR_DB_NAME' with your database name
};

export const getPostsCollection = async () => {
    const db = await connectDB();
    return db.collection('posts');
};

export const getUsersCollection = async () => {
    const db = await connectDB();
    return db.collection('users');
};

