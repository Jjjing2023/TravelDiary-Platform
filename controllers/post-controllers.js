import { Post } from "../models/Post.js";
export const getAllPosts = async (req, res) => {
  let posts;
  try {
    posts = await Post.getAllPosts();
  } catch (err) {
    return console.log(err);
  }

  if (!posts) {
    return res.status(500).json({ message: "Unexpected Error Occured" });
  }

  return res.status(200).json({ posts });
};

export const addPost = async (req, res) => {
  const { title, description, location, date, image, user } = req.body;
  if (
    !title ||
    title.trim() === "" ||
    !description ||
    description.trim() === "" ||
    !location ||
    location.trim() === "" ||
    !date ||
    !image ||
    image.trim() === "" ||
    !user
  ) {
    return res.status(422).json({ message: "Invalid Inputs" });
  }

  const postData = {
    title,
    description,
    location,
    date: new Date(`${date}`),
    image,
    user,
  };

  try {
    const post = await Post.addPostWithUserUpdate(postData);
    return res.status(201).json({ post });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Unexpected Error Occurred" });
  }
};

export const getPostById = async (req, res) => {
  const id = req.params.id;
  let post;
  try {
    post = await Post.getPostById(id);
  } catch (err) {
    return console.log(err);
  }

  if (!post) {
    return res.status(404).json({ message: "No post found" });
  }

  return res.status(200).json({ post });
};

export const updatePost = async (req, res) => {
  const id = req.params.id;
  const { title, description, location, date, image } = req.body;
  if (
    !title ||
    title.trim() === "" ||
    !description ||
    description.trim() === "" ||
    !location ||
    location.trim() === "" ||
    !date ||
    !image ||
    image.trim() === ""
  ) {
    return res.status(422).json({ message: "Invalid Inputs" });
  }
  let post;

  try {
    post = await Post.updatePostById(id, {
      title,
      description,
      location,
      date: new Date(`${date}`),
      image,
    });
  } catch (err) {
    return console.log(err);
  }
  if (!post) {
    return res.status(500).json({ message: "Unable to update" });
  }
  return res.status(200).json({ message: "Post updated successfully" });
};

export const deletePost = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await Post.deletePostWithUserUpdate(id);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ message: "Unexpected Error Occurred" });
  }
};
