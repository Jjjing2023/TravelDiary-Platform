import { ObjectId } from "mongodb";
import { getUsersCollection } from "./db.js"; // <-- Import getUsersCollection from db.js

export const find = async () => {
  const usersCollection = await getUsersCollection();
  return usersCollection.find().toArray();
};

export const createUser = async (userData) => {
  const usersCollection = await getUsersCollection();
  userData.posts = []; // Initialize the posts array for new users
  return await usersCollection.insertOne(userData);
};

export const getUserByEmail = async (email) => {
  const usersCollection = await getUsersCollection();
  return await usersCollection.findOne({ email });
};

export const getAllUsers = async () => {
  const usersCollection = await getUsersCollection();
  return await usersCollection.find().toArray();
};

export const getUserById = async (id) => {
  const usersCollection = await getUsersCollection();
  return await usersCollection.findOne({ _id: new ObjectId(id) });
};

export const updateUserPosts = async (userId, postId) => {
  const usersCollection = await getUsersCollection();
  const result = await usersCollection.updateOne(
    { _id: new ObjectId(userId) },
    { $push: { posts: new ObjectId(postId) } }
  );
  return result.modifiedCount > 0;
};

const User = {
  getUsersCollection,
  find,
  createUser,
  getUserByEmail,
  getAllUsers,
  getUserById,
  updateUserPosts,
};

export { User };
