import prisma from '../../db';

export async function createSurveyResponse(
  rating: number,
  surveyId: number,
  participantId: number,
) {
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
}