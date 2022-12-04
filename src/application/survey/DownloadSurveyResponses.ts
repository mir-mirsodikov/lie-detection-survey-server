import prisma from '../../db';

export async function downloadSurveyResponses(userId: number) {
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
    where: {
      survey: {
        active: {
          equals: true,
        },
        user_id: {
          equals: userId,
        }
      },
    }
  });

  try {
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
    let csv = columns.join(',') + '\n';

    responses.forEach((response) => {
      csv += `${response.id},${response.participant_id},${response.participant.name},${response.participant.email},${response.participant.gender},${response.rating},${response.survey_id},${response.survey.value}\n`;
    });
    return csv;
  } catch (e) {
    throw new Error('Error downloading responses');
  }
}