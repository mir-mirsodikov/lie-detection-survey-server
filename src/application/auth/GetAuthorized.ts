import jwt from 'jsonwebtoken';

export async function getAuthorized(token: string) {
  const secret = process.env.SECRET || 'secret';
  let response = true;
  if (!token) {
    response = false;
  }
  jwt.verify(token as string, secret, (err, auth) => {
    if (err) {
      response = false;
    }
  });

  return response;
}
