import express, { Request, Response } from 'express';
import router from './routes/web';

const app = express();

app.use(express.json());

// Main application routes
app.use('/api', router);

// Root diagnostic endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'CRM System Backend API is active',
    status: 'healthy',
    timestamp: new Date()
  });
});

export default app;
