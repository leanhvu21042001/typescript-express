import * as express from "express";
import Post from "./post.interface";
import postModel from "./posts.model";

// HTTP POST /posts
const createPost = async (
  request: express.Request,
  response: express.Response
) => {
  const postData: Post = request.body;
  const createPost = new postModel(postData);
  const savedPost = await createPost.save();
  return response.send(savedPost);
};

// HTTP GET /posts
const getAllPosts = async (
  _request: express.Request,
  response: express.Response
) => {
  const posts = await postModel.find();
  return response.send(posts);
};

// HTTP GET /posts/:id
const getPostById = async (
  request: express.Request,
  response: express.Response
) => {
  const id = request.params.id;
  const post = await postModel.findById(id);
  return response.send(post);
};

// HTTP GET /posts/:id
const modifyPost = async (
  request: express.Request,
  response: express.Response
) => {
  const id = request.params.id;
  const postData: Post = request.body;
  const post = await postModel.findByIdAndUpdate(id, postData, { new: true });
  return response.send(post);
};

// HTTP GET /posts/:id
const deletePost = async (
  request: express.Request,
  response: express.Response
) => {
  const id = request.params.id;
  const successDelete = await postModel.findByIdAndDelete(id);

  if (successDelete) {
    return response.send(200);
  }

  return response.send(404);
};

export { createPost, getAllPosts, getPostById, modifyPost, deletePost };
