import HttpException from "./HttpException";

class WrongAuthenticationTokenException extends HttpException {
  constructor() {
    super(401, "Authentication token missing");
  }
}

export default WrongAuthenticationTokenException;
