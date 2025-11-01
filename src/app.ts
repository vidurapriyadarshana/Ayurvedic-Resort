import express, { Express, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import connectToDatabase from './database/mongodb';
import { PORT } from './config/env';


// Provide a default port if PORT from env is not set
// and parse it to a number, as 'PORT' from process.env is a string.
const port = parseInt(PORT || '8080', 10);

const app: Express = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Simple route
app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the subscription Tracker API!');
});

/**
 * Starts the server.
 * This function first connects to the database,
 * and only then starts listening for HTTP requests.
 * This prevents the app from running in a broken state if the DB fails.
 */
const startServer = async () => {
    try {
        // 1. Connect to database first
        await connectToDatabase();
        
        // 2. Start listening only after successful DB connection
        app.listen(port, () => {
            console.log(`API running on port ${port}`);
        });

    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1); // Exit if we can't connect to the DB
    }
};

// Execute server start
startServer();

export default app;
