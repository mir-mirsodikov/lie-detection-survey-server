import prisma from '../../db';

export async function getSettings(userId: number) {
  const settings = await prisma.settings.findFirst({
    where: {
      user_id: userId,
    },
  });

  return {
    wordDuration: settings?.word_duration,
    instructions: settings?.instructions,
    endMessage: settings?.end_message,
  };
}
