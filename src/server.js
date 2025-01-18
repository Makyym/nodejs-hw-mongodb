import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { getEnvVar } from './utils/getEnvVar.js';

const PORT = Number(getEnvVar('PORT', '3000'));

export const setupServer = () => {
    const app = express();
    app.use(express.json());
    app.use(cors());
    app.use(
        pino({
            transport: {
                target: 'pino-pretty',
            },
        }),
    );
    // app.get('/', (req, res) => {
    //     res.json({});
    // });
    app.use('*', (req, res, next) => {
        res.status(404).json({
            message: 'Not found'
        });
    });
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};