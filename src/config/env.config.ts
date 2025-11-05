import { config } from "dotenv";

// Load the correct .env file
config({
    path: `.env.${process.env.NODE_ENV || 'development'}.local`
});

// --- Validation ---
// This loop confirms the variables are set
const requiredEnvVars = [
    'DB_URI',
    'JWT_SECRET',
    'JWT_REFRESH_SECRET',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'SERVER_URL',
    'CLIENT_URL'
];

for (const varName of requiredEnvVars) {
    if (!process.env[varName]) {
        throw new Error(`FATAL ERROR: Environment variable "${varName}" is not set.`);
    }
}

// --- Export Config ---

export const PORT = parseInt(process.env.PORT || '3001', 10);
export const NODE_ENV = process.env.NODE_ENV || 'development';

export const DB_URI = process.env.DB_URI!;

// We use '!' to tell TypeScript we *know* these are not undefined
// (because we just checked in the loop above).
export const JWT_SECRET = process.env.JWT_SECRET!; // <-- THE FIX
export const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '15m';

export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!; // <-- THE FIX
export const JWT_REFRESH_EXPIRES_IN: string = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;

export const SERVER_URL = process.env.SERVER_URL!;
export const CLIENT_URL = process.env.CLIENT_URL!;