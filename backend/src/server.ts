import { app } from './app.js';
import { env } from './config/env.js';

app.listen(env.port, () => {
  console.log(`AgendaPro API iniciada em http://localhost:${env.port}`);
});
