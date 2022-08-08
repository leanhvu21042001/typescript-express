import App from "./app";
import PostsController from "./posts/posts.controller";

const port = 5000 || process.env.PORT;
const app = new App([new PostsController()], port);

app.listen();
