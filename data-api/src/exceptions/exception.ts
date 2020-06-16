import { ERROR_CODES } from "./error.codes";

class HttpException extends Error {
  public status: number;
  public message: string;
  public code: string;
  public data?: object;

  constructor(status: number, message: string, code: string, data?: object) {
    super(message);
    this.status = status;
    this.message = message;
    this.code = code;
    this.data = data;
  }
}

// Generic assertion error
class AssertionErrorException extends HttpException {
  constructor(message: string) {
    super(400, message, ERROR_CODES.ASSERTION_ERROR);
  }
}

class InvalidQueryParametarsException extends HttpException {
  constructor(message: string) {
    super(400, message, ERROR_CODES.INVALID_QUERY_PARAMETERS);
  }
}

class ObjectNotFoundException extends HttpException {
  constructor(code: ERROR_CODES) {
    super(404, "", code);
  }
}

class UserWithEmailAlreadyExistsException extends HttpException {
  constructor(email: string) {
    const data: object = { email: email };
    super(400, `User with email ${email} already exists`, ERROR_CODES.USER_EMAIL_ALREADY_EXISTS, data);
  }
}

class UserPasswordDoesNotMatchException extends HttpException {
  constructor() {
    super(400, `Wrong password`, ERROR_CODES.USER_PASSWORD_NOT_MATCH);
  }
}


class WrongCredentialsException extends HttpException {
  constructor(username: string) {
    super(401, `Wrong credentials provided. Username: ${username}`, ERROR_CODES.WRONG_CREDENTIALS);
  }
}


class AuthenticationTokenMissingException extends HttpException {
  constructor() {
    super(401, 'Authentication token missing', ERROR_CODES.AUTHENTICATION_TOKEN_MISSING);
  }
}


class WrongAuthenticationTokenException extends HttpException {
  constructor() {
    super(401, `Wrong authentication token.`, ERROR_CODES.WRONG_AUTHENTICATION_TOKEN);
  }
}

class DatabaseException extends HttpException {
  constructor(code: number, message: string) {
    super(code, message, ERROR_CODES.SERVER_EXCEPTION);
  }
}

class RedundantUpdateErrorException extends HttpException {
  constructor(message: string = 'No updated values provided') {
    super(412, message, ERROR_CODES.REDUNDANT_UPDATE);
  }
}

class AccessControlException extends HttpException {
  constructor() {
    super(403, `Access denied`, ERROR_CODES.ACCESS_CONTROL);
  }
}

class CsvParseError extends HttpException {
  constructor(code: number, message: string) {
    super(code, message, ERROR_CODES.CSV_PARSE_ERROR);
  }
}

export {
  HttpException,
  AssertionErrorException,
  InvalidQueryParametarsException,
  ObjectNotFoundException,
  UserWithEmailAlreadyExistsException,
  UserPasswordDoesNotMatchException,
  WrongCredentialsException,
  AuthenticationTokenMissingException,
  WrongAuthenticationTokenException,
  DatabaseException,
  RedundantUpdateErrorException,
  AccessControlException,
  CsvParseError,
}