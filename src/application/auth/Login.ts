import prisma from '../../db';
import { generateToken } from './GenerateToken';

export async function login(username: string, password: string) {
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (user) {
    const authToken = await generateToken(user.id);

    return {
      token: authToken,
      id: user.id,
      name: user.name,
    };
  }
}