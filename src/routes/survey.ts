import { Router, Request, Response } from 'express';
import prisma from '../db';

const router = Router();

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
    }
  });

  res.json(values);
});

export default router;
