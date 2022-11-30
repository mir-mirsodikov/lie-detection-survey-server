import { Router, Request, Response } from 'express';
import { createParticipant } from '../application/participant/CreateParticipant';
import { getSettings } from '../application/settings/GetSettings';
import { createSurveyResponse } from '../application/survey/CreateSurveyResponse';
import { listSurveyForParticipants } from '../application/survey/ListSurveysForParticipants';

const router = Router();

router.post('/participant', async (req: Request, res: Response, next) => {
  const { name, email, gender } = req.body;

  try {
    const participant = await createParticipant(name, email, gender);
    res.json(participant);
  } catch (e) {
    return next(new Error('Email is already in use'));
  }
});

router.get('/:userId', async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId);
  const surveys = await listSurveyForParticipants(userId);

  res.json(surveys);
});

router.post('/', async (req: Request, res: Response) => {
  const { rating, surveyId, participantId } = req.body;

  await createSurveyResponse(rating, surveyId, participantId); 

  res.json();
});

router.get('/settings/:userId', async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId);
  const settings = await getSettings(userId);

  res.json(settings);
});

export default router;
