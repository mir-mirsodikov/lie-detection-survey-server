import prisma from '../../db';

export async function listSurveyForParticipants(userId: number) {
  const surveys = await prisma.survey.findMany({
    where: {
      active: true,
      user_id: userId,
    },
  });

  return surveys.map((survey) => {
    return {
      id: survey.id,
      value: survey.value,
    };
  });
}
