import dotenv from 'dotenv';
import App from './express';
import * as http from 'http';
dotenv.config();


async function main() {
  const app = new App();
  app.setup();

  const server: http.Server = http.createServer(app.app);
  const port = process.env.PORT ?? 3000;
  server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
  });
}

main().catch(err => console.error(err));