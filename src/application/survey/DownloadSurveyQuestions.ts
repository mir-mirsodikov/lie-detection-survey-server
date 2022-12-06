import prisma from '../../db';

export async function downloadQuestions(userId: number) {
  const questions = await prisma.survey.findMany({
    where: {
      active: true,
      user_id: userId,
    },
    orderBy: {
      id: 'asc',
    },
    select: {
      id: true,
      value: true,
    },
  });

  try {
    const columns = ['ID', 'Question'];
    let csv = columns.join(',') + '\n';

    for (const question of questions) {
      csv += `${question.id},"${question.value}"\n`;
    }
    return csv;
  } catch (e) {
    throw new Error('Error downloading questions');
  }
}