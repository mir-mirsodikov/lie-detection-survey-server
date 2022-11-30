import jwt from 'jsonwebtoken';

export async function generateToken(userId: number) {
  const secret = process.env.SECRET || 'secret';

  const token = jwt.sign(
    {
      iss: 'survey-api',
      sub: userId,
    },
    secret,
    { expiresIn: '24h' },
  );

  return token;
}