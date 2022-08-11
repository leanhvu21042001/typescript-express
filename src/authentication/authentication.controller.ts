import * as bcrypt from "bcrypt";
import * as express from "express";
import userModel from "../users/user.model";
import Controller from "../interfaces/controller.interface";
import WrongCredentialsException from "../exceptions/WrongCredentialsException";
import UserWithThatEmailAlreadyExistsException from "../exceptions/UserWithThatEmailAlreadyExistsException";
import validationMiddleware from "../middleware/validation.middleware";
import LogInDto from "./LogIn.dto";
import CreateUserDto from "../users/user.dto";
import User from "users/user.interface";
import tokenData from "interfaces/toktokenData.interface";
import dataStoredInToken from "interfaces/dataStoredInToken";
import * as jwt from "jsonwebtoken";

class AuthenticationController implements Controller {
  public path = "/auth";
  public router = express.Router();
  private user = userModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/register`,
      validationMiddleware(CreateUserDto),
      this.registration
    );
    this.router.post(
      `${this.path}/login`,
      validationMiddleware(LogInDto),
      this.logginIn
    );
  }

  private registration = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const userData: CreateUserDto = request.body;
    if (await this.user.findOne({ email: userData.email })) {
      next(new UserWithThatEmailAlreadyExistsException(userData.email));
    } else {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await this.user.create({
        ...userData,
        passowrd: hashedPassword,
      });
      user.password = undefined;
      const tokenData = this.createToken(user);
      response.setHeader("Set-Cookie", [this.createCookie(tokenData)]);
      return response.send(user);
    }
  };

  private logginIn = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const logInData: LogInDto = request.body;
    const user = await this.user.findOne({ email: logInData.email });

    if (user) {
      const isPasswordMatching = await bcrypt.compare(
        logInData.password,
        user.password
      );

      if (isPasswordMatching) {
        user.password = undefined;
        return response.send(user);
      } else {
        return next(new WrongCredentialsException());
      }
    } else {
      return next(new WrongCredentialsException());
    }
  };

  private createCookie(tokenData: tokenData) {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
  }
  private createToken(user: User): tokenData {
    const expiresIn = 60 * 60; // an hour
    const secret = process.env.JWT_SECRET;
    const dataStoredInToken: dataStoredInToken = {
      _id: user._id,
    };

    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
    };
  }
}

export default AuthenticationController;
