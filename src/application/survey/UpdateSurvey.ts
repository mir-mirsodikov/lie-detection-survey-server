import prisma from '../../db';

export async function updateSurvey(id: number, value: string, isActive: boolean) {
  const survey = await prisma.survey.update({
    where: {
      id,
    },
    data: {
      value,
      active: isActive,
    },
  });

  return {
    id: survey.id,
    value: survey.value,
    active: survey.active,
  };
}