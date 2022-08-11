import { NextFunction, Response } from "express";
import * as jwt from "jsonwebtoken";
import AuthenticationTokenMissingException from "../exceptions/AuthenticationTokenMissingException";
import WrongAuthenticationTokenException from "../exceptions/WrongAuthenticationTokenException";
import dataStoredInToken from "../interfaces/dataStoredInToken";
import RequestWithUser from "../interfaces/requestWithUser.interface";
import userModel from "../users/user.model";

async function authMiddleware(
  request: RequestWithUser,
  response: Response,
  next: NextFunction
) {
  const cookies = request.cookies;

  if (cookies && cookies.Authorization) {
    const secret = process.env.JWT_SECRET;
    try {
      const verificationResponse = jwt.verify(
        cookies.Authorization,
        secret
      ) as dataStoredInToken;
      const id = verificationResponse._id;
      const user = await userModel.findById(id);

      if (user) {
        request.user = user;
        return next();
      } else {
        return next(new WrongAuthenticationTokenException());
      }
    } catch (error) {
      return next(new WrongAuthenticationTokenException());
    }
  } else {
    return next(new WrongAuthenticationTokenException());
  }
}

export default authMiddleware;
