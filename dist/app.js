import express from 'express';
import router from './routes/web';
const app = express();
app.use(express.json());
// Main application routes
app.use('/api', router);
// Root diagnostic endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'CRM System Backend API is active',
        status: 'success',
        timestamp: new Date()
    });
});
export default app;
