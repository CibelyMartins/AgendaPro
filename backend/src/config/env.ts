import dotenv from 'dotenv';

dotenv.config();

const port = Number(process.env.PORT ?? 3000);

if (Number.isNaN(port)) {
  throw new Error('A variável de ambiente PORT deve ser um número válido.');
}

export const env = {
  port,
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseSecretKey: process.env.SUPABASE_SECRET_KEY,
};
