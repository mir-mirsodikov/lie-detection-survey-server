import prisma from '../../db';

export async function createParticipant(
  name: string,
  email: string,
  gender: string,
) {
  const participant = await prisma.participant.create({
    data: {
      name,
      email,
      gender: gender.toLowerCase(),
    },
  });

  return {
    id: participant.id,
    name: participant.name,
    email: participant.email,
  }
}
