import * as express from "express";
import Controller from "../interfaces/controller.interface";
import Post from "./post.interface";
import postModel from "./posts.model";
import PostNotFoundException from "../exceptions/PostNotFoundException";
import validationMiddleware from "../middleware/validation.middleware";
import CreatePostDto from "./post.dto";

class PostsController implements Controller {
  public path = "/posts";
  public router = express.Router();
  private post = postModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getAllPosts);
    this.router.get(`${this.path}/:id`, this.getPostById);
    this.router.patch(
      `${this.path}/:id`,
      validationMiddleware(CreatePostDto, true),
      this.modifyPost
    );
    this.router.delete(`${this.path}/:id`, this.deletePost);
    this.router.post(
      this.path,
      validationMiddleware(CreatePostDto),
      this.createPost
    );
  }

  private getAllPosts = async (
    _request: express.Request,
    response: express.Response
  ) => {
    const posts = await this.post.find();

    return response.send(posts);
  };

  private getPostById = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const id = request.params.id;
    const post = await this.post.findById(id);

    if (!post) {
      return next(new PostNotFoundException(id));
    }

    return response.send(post);
  };

  private modifyPost = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const id = request.params.id;
    const postData: Post = request.body;
    const post = await this.post.findByIdAndUpdate(id, postData, { new: true });

    if (!post) {
      return next(new PostNotFoundException(id));
    }

    return response.send(post);
  };

  private createPost = async (
    request: express.Request,
    response: express.Response
  ) => {
    const postData: Post = request.body;
    const createdPost = new this.post(postData);
    const savedPost = await createdPost.save();

    return response.send(savedPost);
  };

  private deletePost = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const id = request.params.id;
    const deletedPost = await this.post.findByIdAndDelete(id);

    if (!deletedPost) {
      return next(new PostNotFoundException(id));
    }

    return response.sendStatus(200);
  };
}

export default PostsController;
