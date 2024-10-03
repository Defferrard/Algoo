import dotenv from 'dotenv';

dotenv.config();

export const JWT_SECRET: string = process.env.JWT_SECRET!;
export const PORT: number = +(process.env.PORT || 8080);