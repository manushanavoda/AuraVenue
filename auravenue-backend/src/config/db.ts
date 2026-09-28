import { Pool } from 'pg';
import dotenv from 'dotenv';

// .env file එකේ තියෙන credentials load කරගැනීමට
dotenv.config();

// PostgreSQL Connection Pool එක සකස් කිරීම
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
  max: 20, // එකවර DB එකට සම්බන්ධ විය හැකි උපරිම connections ගණන
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Database එකට successfully connect වුණාම console එකේ message එකක් පෙන්වීම
pool.on('connect', () => {
  console.log('⚡ Connected successfully to PostgreSQL (auravenue_db)');
});

// DB connection එකේ කිසියම් දෝෂයක් ආවොත් සටහන් කරගැනීම
pool.on('error', (err) => {
  console.error('❌ Unexpected DB connection error:', err);
  process.exit(-1);
});

// Backend එකේ ඕනෑම තැනක සිට SQL Query run කිරීමට සකස් කළ Helper Function එක
export const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
};

export default pool;