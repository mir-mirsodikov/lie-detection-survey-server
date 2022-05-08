import { Router, Request, Response } from 'express';
import prisma from '../db';

const router = Router();

router.post('/participant', async (req: Request, res: Response) => {
  const { name, email, gender } = req.body;

  const participant = await prisma.participant.create({
    data: {
      name,
      email,
      gender: gender.toLowerCase(),
    },
  });

  res.json({
    id: participant.id,
    name: participant.name,
    email: participant.email,
  });
});

router.get('/', async (req: Request, res: Response) => {
  const surveys = await prisma.survey.findMany({
    where: {
      active: true,
    },
  });

  const values = surveys.map((survey) => {
    return {
      id: survey.id,
      value: survey.value,
    };
  });

  res.json(values);
});

router.post('/', async (req: Request, res: Response) => {
  const { rating, surveyId, participantId } = req.body;

  const found = await prisma.survey_response.findFirst({
    where: {
      survey_id: surveyId,
      participant_id: participantId,
    },
  });

  if (!found) {
    await prisma.survey_response.create({
      data: {
        rating: Number(rating),
        survey_id: Number(surveyId),
        participant_id: Number(participantId),
      },
    });
  } else {
    await prisma.survey_response.update({
      where: {
        id: found.id,
      },
      data: {
        rating: Number(rating),
      },
    });
  }

  res.json();
});

export default router;
