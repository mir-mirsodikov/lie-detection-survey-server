import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import prisma from '../db';

const router = Router();
const secret = 'secret';

router.post(
  '/login',
  passport.authenticate('local'),
  async (req: Request, res: Response) => {
    const { username } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (user) {
      const token = jwt.sign(
        {
          iss: 'survey-api',
          sub: user.id,
        },
        secret,
        {expiresIn: '24h'}
      );
    }
  },
);
