import * as express from "express";
import * as bodyParser from "body-parser";
import * as mongoose from "mongoose";
import Controller from "./interfaces/controller.interface";

class App {
  public app: express.Application;
  public port: number;

  constructor(controllers: Controller[]) {
    this.app = express();

    this.connectToTheDatabase();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
  }

  public listen() {
    const port = process.env.PORT;

    return this.app.listen(port, () => {
      console.log(`App listening on the port ${port}`);
      console.log(`http://localhost:${port}`);
    });
  }

  private initializeMiddlewares() {
    return this.app.use(bodyParser.json());
  }

  private initializeControllers(controllers: Controller[]) {
    return controllers.forEach((controller) => {
      this.app.use("/", controller.router);
    });
  }

  private async connectToTheDatabase() {
    const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH } = process.env;

    try {
      const MONGO_URI = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}/?retryWrites=true&w=majority`;
      const conn = await mongoose.connect(MONGO_URI);
      console.log(`DB Connected`);

      return conn;
    } catch (error) {
      console.error(error);
    }
  }
}

export default App;
