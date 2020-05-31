import config from 'config';
import { NextFunction, Response } from 'express';
import fs from 'fs';
import * as jwt from 'jsonwebtoken';
import moment from 'moment';
import util from 'util';

import { RequestWithUser } from '../controllers/internal/auth/requestWithUser.interface';
import { getUserGrants } from '../controllers/internal/user/userAccess.verify';
import { AuthenticationTokenMissingException, DatabaseException, WrongAuthenticationTokenException } from '../exceptions/exception';
import { IUser } from '../infrastructure/entities/user.interface';
import { DIContainer } from '../services/config/inversify.config';
import { TYPES } from '../services/config/types';
import { IUserService } from '../services/interfaces/user.service.interface';
import { logger } from '../utils/logger';
import { IDataStoredInToken } from './data-stored-in-token.interface';
import { ITokenData } from './token-data.interface';

export class UserToken {
  private static jwtSign = util.promisify(jwt.sign);
  private static jwtVerify = util.promisify(jwt.verify);

  private static RSA_PVT_KEY: string = fs.readFileSync(config.get('session.pvtKey'), 'utf8');
  private static RSA_PUB_KEY: string = fs.readFileSync(config.get('session.pubKey'), 'utf8');

  public static create(user: IUser, permissions: any): ITokenData {
    const start = moment(user.createdAt);
    // If expiry date is missing, create a month valid token
    const end = user.expireOn ? moment(user.expireOn) : moment().add(1, 'months');
    const expInDays: string = moment.duration(end.diff(start)).asDays() + 'd';
    logger.debug(`UserToken: create: expiresIn = ${expInDays}, user = ${JSON.stringify(user)}`);

    const dataStoredInToken: IDataStoredInToken = {
      id: user._id as string,
      role: user.role,
      permissions: permissions,
    };

    // RS256 accepts public and private key
    const token = jwt.sign({ ...dataStoredInToken }, this.RSA_PVT_KEY, { algorithm: 'RS256', expiresIn: expInDays });

    return {
      expireOn: user.expireOn,
      token: token,
    } as ITokenData;
  }

  public static async verify(request: RequestWithUser, response: Response, next: NextFunction) {

    const authorizationHeader = request.headers.authorization;
    logger.debug('UserToken: verify: ');

    if (!authorizationHeader) {
      return next(new AuthenticationTokenMissingException());
    }

    const token = authorizationHeader.split(' ')[1]; // Bearer <token>
    let userId: string;

    try {
      const verificationResponse = await UserToken.jwtVerify(token, UserToken.RSA_PUB_KEY) as IDataStoredInToken;
      userId = verificationResponse.id;
      logger.debug('UserToken: verify: DataStoredInToken = ' + JSON.stringify(verificationResponse));
    } catch (error) {
      logger.debug(`UserToken: verify: error = ${error.message}`);
      return next(new WrongAuthenticationTokenException());
    }

    try {
      const userService: IUserService = DIContainer.get<IUserService>(TYPES.IUserService);
      const user: IUser = await userService.get(userId);

      if (user) {
        request.user = user;
        next();
      } else {
        next(new WrongAuthenticationTokenException());
      }
    } catch (error) {
       next(new DatabaseException(500, error.mess));
    }
  }

  public static async getAllGrants(role: string) {
    const userGrants = await getUserGrants(role);
    const allGrants = { ...userGrants };

    return allGrants;
  }

}
