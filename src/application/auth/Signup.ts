import prisma from '../../db';
import { AuthenticationError } from '../errors';
import { generateToken } from './GenerateToken';

export async function signup(name: string, username: string, password: string) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        username,
      },
    });

    if (user) {
      throw new AuthenticationError('Username already exists');
    }
  } catch (error) {
    throw new AuthenticationError('Username already exists');
  }

  const user = await prisma.user.create({
    data: {
      name,
      username,
      password,
    },
  });

  if (user) {
    const token = await generateToken(user.id);
    return {
      token,
      id: user.id,
      name: user.name,
    };
  }
}