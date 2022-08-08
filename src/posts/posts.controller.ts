import * as express from "express";
import Post from "./post.interface";

class PostsController {
  public path = "/posts";
  public router = express.Router();

  private posts: Post[] = [
    {
      author: "lav",
      content: "learn typescript express",
      title: "learn",
    },
  ];

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.get(this.path, this.getAllPosts);
    this.router.post(this.path, this.createAPost);
  }

  getAllPosts = (_request: express.Request, response: express.Response) => {
    return response.send(this.posts);
  };

  createAPost = (request: express.Request, response: express.Response) => {
    const post: Post = request.body;
    this.posts.push(post);

    return response.send(post);
  };
}

export default PostsController;
