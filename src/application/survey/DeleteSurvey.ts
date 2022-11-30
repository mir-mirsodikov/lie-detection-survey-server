import prisma from '../../db';

export async function deleteSurvey(id: number) {
  const currentSurvey = await prisma.survey.findUnique({
    where: {
      id,
    },
  });

  if (!currentSurvey?.active) {
    await prisma.survey_response.deleteMany({
      where: {
        survey_id: id,
      },
    });

    await prisma.survey.delete({
      where: {
        id,
      },
    });
    return;
  }

  const response = await prisma.survey.update({
    where: {
      id,
    },
    data: {
      active: !currentSurvey?.active ?? false,
    },
  });

  return {
    id: response.id,
    value: response.value,
    active: response.active,
  };
}
