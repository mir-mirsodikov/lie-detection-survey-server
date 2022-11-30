import { Router, Request, Response, NextFunction } from 'express';
import passport from 'passport';
import passportLocal from 'passport-local';
import prisma from '../db';
import { Parser, Transform, transforms } from 'json2csv';
import { createSettings } from '../application/settings/CreateNewSettings';
import { login } from '../application/auth/Login';
import { AuthenticationError } from '../application/errors';
import { validateToken } from '../middleware/TokenValidation';
import { signup } from '../application/auth/Signup';
import { listSurveys } from '../application/survey/ListAllSurveys';
import { createSurvey } from '../application/survey/CreateSurvey';
import { updateSurvey } from '../application/survey/UpdateSurvey';
import { deleteSurvey } from '../application/survey/DeleteSurvey';
import { getAuthorized } from '../application/auth/GetAuthorized';

const router = Router();
const LocalStrategy = passportLocal.Strategy;

passport.use(
  new LocalStrategy({ session: false }, async function (
    username: string,
    password: string,
    done,
  ) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          username,
        },
      });

      if (!user) {
        throw new AuthenticationError();
      }
      if (password !== user.password) {
        throw new AuthenticationError();
      }

      return done(null, user);
    } catch (error) {
      return done(new AuthenticationError('Invalid username or password'));
    }
  }),
);

/**
 * Login a user with their username and password
 * Sends back a token to be used for future requests
 */
router.post(
  '/login',
  passport.authenticate('local', { session: false }),
  async (req: Request, res: Response) => {
    const { username, password } = req.body;

    const response = await login(username, password);

    res.json(response);
  },
);

/**
 * Create a new user and return the token
 */
router.post(
  '/signup',
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, username, password } = req.body;

    try {
      const user = await signup(name, username, password);
      res.json(user);
    } catch (error) {
      next(error);
    }
  },
);

/**
 * Create a survey for the user
 */
router.post('/survey', validateToken, async (req: Request, res: Response) => {
  const { value, userId } = req.body;
  const survey = await createSurvey(userId, value);
  res.json(survey);
});

/**
 * Get all surveys for the user
 */
router.get(
  '/survey/:userId',
  validateToken,
  async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);

    const surveys = await listSurveys(userId);
    res.json(surveys);
  },
);

/**
 * Update a survey
 */
router.patch(
  '/survey/:id',
  validateToken,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { value, isActive } = req.body;

    const updatedSurvey = await updateSurvey(parseInt(id), value, isActive);

    res.json(updatedSurvey);
  },
);

/**
 * Delete a survey
 */
router.delete(
  '/survey/:id',
  validateToken,
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const deletedSurvey = await deleteSurvey(parseInt(id));

    res.json(deletedSurvey);
  },
);

/**
 * Create the settings for a user if not already created
 * Otherwise, update the settings
 */
router.post('/settings', validateToken, async (req: Request, res: Response) => {
  const { instructions, wordDuration, endMessage, userId } = req.body;

  const settings = await createSettings({
    id: userId,
    instructions,
    wordDuration,
    endMessage,
  });

  res.json(settings);
});

router.get('/authorize', async (req: Request, res: Response) => {
  const token = req.headers.authorization;
  if (token) {
    const response = await getAuthorized(token);
    res.send(response);
  }
});

router.get(
  '/download/questions',
  validateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    const questions = await prisma.survey.findMany({
      where: {
        active: true,
      },
      orderBy: {
        id: 'asc',
      },
      select: {
        id: true,
        value: true,
      },
    });

    try {
      const parser = new Parser();
      const csv = parser.parse(questions);
      res.setHeader('Content-Type', 'text/csv');
      res.attachment('questions.csv');
      res.send(csv);
    } catch (e) {
      return next(new Error('Error downloading questions'));
    }
  },
);

router.get(
  '/download/responses',
  validateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    const responses = await prisma.survey_response.findMany({
      orderBy: {
        participant_id: 'asc',
      },
      select: {
        id: true,
        participant_id: true,
        participant: {
          select: {
            name: true,
            email: true,
            gender: true,
          },
        },
        rating: true,
        survey_id: true,
        survey: {
          select: {
            value: true,
          },
        },
      },
    });

    try {
      const { flatten } = transforms;
      const columns = [
        'ID',
        'Participant ID',
        'Name',
        'Email',
        'Gender',
        'Response',
        'Question ID',
        'Question',
      ];
      const parser = new Parser({ fields: columns, transforms: [flatten()] });
      const csv = parser.parse(responses);
      res.setHeader('Content-Type', 'text/csv');
      res.attachment('responses.csv');
      res.send(csv);
    } catch (e) {
      return next(new Error('Error downloading responses'));
    }
  },
);

export default router;
