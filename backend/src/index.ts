import express from 'express';
import cors from 'cors';
import applicationRouter from './routers/application-router.js';
import companyRouter from './routers/company-router.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api/applications', applicationRouter);
app.use('/api/companies', companyRouter);
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
