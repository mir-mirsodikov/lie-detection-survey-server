import prisma from '../../db';

export async function createSurvey(userId: number, value: string) {
  const survey = await prisma.survey.create({
    data: {
      value,
      user_id: userId,
    },
  });

  return {
    id: survey.id,
    value: survey.value,
    active: survey.active,
  };
}
