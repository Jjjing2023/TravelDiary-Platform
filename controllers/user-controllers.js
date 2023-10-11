import pkg from "bcryptjs";
const { compareSync } = pkg;
const { hashSync } = pkg;
import { User } from "../models/User.js";
import { ObjectId } from "mongodb";
import { getPostsCollection } from "../db/db.js"; // <-- Import getUsersCollection from db.js


export const getAllUsers = async (req, res) => {
  let users;
  try {
    users = await User.find();
  } catch (err) {
    return console.log(err);
  }

  if (!users) {
    return res.status(500).json({ message: "Unexpected Error Occured" });
  }

  return res.status(200).json({ users });
};

export const signup = async (req, res, next) => {
  const { name, email, password } = req.body;
  if (
    !name ||
    name.trim() === "" ||
    !email ||
    email.trim() === "" ||
    !password ||
    password.length < 6
  ) {
    return res.status(422).json({ message: "Invalid Inputs" });
  }

  const hashedPassword = hashSync(password);

  let user;
  try {
    const userData = { name, email, password: hashedPassword };
    const result = await User.createUser(userData);
    if (!result || result.acknowledged !== true) {
      throw new Error("User creation failed!");
    }
    user = {
      ...userData,
      _id: result.insertedId,
    };
  } catch (err) {
    return next(err);
  }
  if (!user) {
    return res.status(500).json({ message: "Unexpected Error Occured" });
  }
  return res.status(201).json({ user });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || email.trim() === "" || !password || password.length < 6) {
    return res.status(422).json({ message: "Invalid Inputs" });
  }

  let exsitingUser;
  try {
    exsitingUser = await User.getUserByEmail(email);
  } catch (err) {
    return next(err);
  }
  if (!exsitingUser) {
    return res.status(404).json({ message: "No user found" });
  }
  const isPasswordCorrect = compareSync(password, exsitingUser.password);
  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Incorrect password" });
  }
  return res
    .status(200)
    .json({
      id: exsitingUser._id,
      name: exsitingUser.name,
      posts: exsitingUser.posts,
      message: "Logged in!",
    });
};

export const getUserById = async (req, res) => {
  const id = req.params.id;
  let user;
  let userPosts = [];

  try {
    user = await User.getUserById(id);
    if (user && user.posts && user.posts.length > 0) {
      const postsCollection = await getPostsCollection();
      userPosts = await postsCollection
        .find({
          _id: { $in: user.posts.map((postId) => new ObjectId(postId)) },
        })
        .toArray();
    }
  } catch (err) {
    return console.log(err);
  }

  if (!user) {
    return res.status(404).json({ message: "No user found" });
  }

  // Return the user along with their posts
  return res.status(200).json({ user, posts: userPosts });
};
