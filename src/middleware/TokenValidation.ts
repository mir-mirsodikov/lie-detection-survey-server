import { Request, Response, NextFunction } from 'express';
import { AuthenticationError } from '../application/errors';
import jwt from 'jsonwebtoken';

/**
 * Given a token from the authorization header, validate that the user is authenticated
 *
 * @param req
 * @param res
 * @param next
 */
export async function validateToken(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization;
  const secret = process.env.SECRET || 'secret';
  
  if (!token) {
    throw new AuthenticationError('No token provided');
  }

  jwt.verify(token, secret, (err, auth) => {
    if (err) {
      throw new AuthenticationError('Invalid token');
    }
  });

  next();
}