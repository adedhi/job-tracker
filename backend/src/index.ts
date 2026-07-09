import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRouter from './routers/auth-router.js';
import applicationRouter from './routers/application-router.js';
import companyRouter from './routers/company-router.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/applications', applicationRouter);
app.use('/api/companies', companyRouter);
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
