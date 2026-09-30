import cors from 'cors';
import express from 'express';
import appointmentRoutes from './routes/appointmentRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';

export const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (_request, response) => {
  return response.status(200).json({
    message: 'AgendaPro API',
    version: '1.0.0',
  });
});

app.get('/health', (_request, response) => {
  return response.status(200).json({ message: 'API está funcionando.' });
});

app.use('/categories', categoryRoutes);
app.use('/services', serviceRoutes);
app.use('/appointments', appointmentRoutes);

app.use((_request, response) => {
  return response.status(404).json({
    success: false,
    message: 'Rota não encontrada.',
  });
});
