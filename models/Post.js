import { ObjectId } from "mongodb";
import { getUsersCollection } from "./db.js"; // <-- Import getUsersCollection from db.js
import { getPostsCollection } from "./db.js"; // <-- Import getUsersCollection from db.js
import { client } from "./db.js";

export const getAllPosts = async () => {
  const postsCollection = await getPostsCollection();
  return await postsCollection.find().toArray();
};

const getPostById = async (id) => {
  // Validate the post ID format
  if (!ObjectId.isValid(id)) {
    throw new Error("Invalid Post ID format.");
  }

  const postsCollection = await getPostsCollection();
  return await postsCollection.findOne({ _id: new ObjectId(id) });
};

// const addPost = async (postData) => {
//     const postsCollection = await getPostsCollection();
//     return await postsCollection.insertOne(postData);
// };
export const addPost = async (postData) => {
  const postsCollection = await getPostsCollection();
  return await postsCollection.insertOne(postData);
};

export const updatePostById = async (id, updateData) => {
  const postsCollection = await getPostsCollection();
  const result = await postsCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: updateData }
  );
  return result;
};

export const deletePostById = async (id) => {
  const postsCollection = await getPostsCollection();
  const result = await postsCollection.deleteOne({ _id: new ObjectId(id) });
  if (result.deletedCount === 0) {
    return null; // No document was deleted. Return null.
  }

  return { message: "User successfully deleted" }; // Return a success message.
};

export const addPostWithUserUpdate = async (postData) => {
  let session;

  try {
    session = client.startSession();
    session.startTransaction();

    const postsCollection = await getPostsCollection();
    const postResult = await postsCollection.insertOne(postData, { session });
    if (!postResult || postResult.acknowledged !== true) {
      throw new Error("Post creation failed!");
    }

    const usersCollection = await getUsersCollection(); // Assuming you've exported this function from db.js
    const userUpdateResult = await usersCollection.updateOne(
      { _id: new ObjectId(postData.user) },
      { $push: { posts: postResult.insertedId } },
      { session }
    );
    if (!userUpdateResult || userUpdateResult.modifiedCount !== 1) {
      throw new Error("Failed to update user's post list");
    }

    await session.commitTransaction();
    session.endSession();
    client.close();

    return {
      ...postData,
      _id: postResult.insertedId,
    };
  } catch (err) {
    if (session && session.inTransaction()) {
      session.abortTransaction();
      session.endSession();
    }
    if (client) {
      // Ensure the client is closed even if an error occurs
      client.close();
    }
    throw err; // Rethrow the error to be handled in the controller.
  }
};

export const deletePostWithUserUpdate = async (id) => {
  let session;

  try {
    session = client.startSession();
    session.startTransaction();

    const postsCollection = await getPostsCollection();

    const post = await postsCollection.findOne(
      { _id: new ObjectId(id) },
      { session }
    );
    if (!post) {
      throw new Error("No post found");
    }
    await postsCollection.deleteOne({ _id: new ObjectId(id) }, { session });

    const usersCollection = await getUsersCollection();
    const userId = new ObjectId(post.user);
    const userUpdateResult = await usersCollection.updateOne(
      { _id: userId },
      { $pull: { posts: post._id } },
      { session }
    );

    if (!userUpdateResult || userUpdateResult.modifiedCount !== 1) {
      throw new Error("Failed to update user's post list");
    }

    await session.commitTransaction();
    session.endSession();
    client.close();

    return { message: "Post deleted successfully" };
  } catch (err) {
    if (session && session.transaction.state !== "TRANSACTION_ABORTED") {
      session.abortTransaction();
    }
    if (client) {
      client.close();
    }
    throw err;
  }
};

const Post = {
  addPost,
  getPostsCollection,
  getAllPosts,
  getPostById,
  updatePostById,
  deletePostById,
  addPostWithUserUpdate,
  deletePostWithUserUpdate,
};

export { Post };
