import cors from 'cors';
import express from 'express';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';
import { router } from './routes/index.js';

export const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', router);
app.use(notFoundHandler);
app.use(errorHandler);
