import { ISettings } from '../../model/settings';
import prisma from '../../db';

export async function createSettings(dto: ISettings) {
  const { id, wordDuration, instructions, endMessage } = dto;
  const currentSettings = await prisma.settings.findFirst({
    where: {
      user_id: id,
    },
  });

  let settings;

  if (!currentSettings) {
    settings = await prisma.settings.create({
      data: {
        instructions: instructions ?? '',
        word_duration: Number(wordDuration) ?? 0,
        end_message: endMessage ?? '',
        user_id: id,
      },
    });
  } else {
    settings = await prisma.settings.update({
      where: {
        user_id: currentSettings.user_id,
      },
      data: {
        instructions: instructions,
        word_duration: Number(wordDuration),
        end_message: endMessage,
      },
    });
  }

  return {
    id: settings.user_id,
    wordDuration: settings.word_duration,
    instructions: settings.instructions,
    endMessage: settings.end_message,
  };
}
