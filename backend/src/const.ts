import dotenv from 'dotenv';

dotenv.config();

export const JWT_SECRET: string = process.env.JWT_SECRET!;