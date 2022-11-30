import prisma from '../../db';

export async function listSurveys(userId: number) {
  const surveys = await prisma.survey.findMany({
    orderBy: {
      id: 'asc',
    },
    where: {
      user_id: userId,
    },
  });

  return surveys.map((survey) => {
    return {
      id: survey.id,
      value: survey.value,
      active: survey.active,
    };
  });
}