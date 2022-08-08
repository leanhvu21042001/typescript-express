import * as express from "express";
import { plainToClass } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import HttpException from "../exceptions/HttpException";

const validationMiddleware = <T>(
  type: any,
  skipMissingProperties = false
): express.RequestHandler => {
  return (
    req: express.Request,
    _res: express.Response,
    next: express.NextFunction
  ) => {
    validate(plainToClass(type, req.body), { skipMissingProperties }).then(
      (errors: ValidationError[]) => {
        if (errors.length > 0) {
          const message = errors
            .map((error: ValidationError) => Object.values(error.constraints))
            .join(", ");
          return next(new HttpException(400, message));
        }

        return next();
      }
    );
  };
};

export default validationMiddleware;
