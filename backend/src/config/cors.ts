import { CorsOptions } from 'cors';

export const corsConfig: CorsOptions = {
    origin: function (origin, callback) {
        const whitelist = [process.env.FRONTEND_URL];

        // Permitir llamadas sin origen (como las hechas con Postman o curl)
        if (process.argv[2] === '--api') {
            whitelist.push(undefined);
        }

        // Permitir llamadas desde el mismo origen (localhost)
        if (whitelist.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
};