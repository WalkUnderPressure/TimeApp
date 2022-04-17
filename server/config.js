import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.SERVER_PORT;
const QUERY_PATH = process.env.QUERY_PATH;
const SUBS_PATH = process.env.SUBS_PATH;

export {
    PORT, QUERY_PATH, SUBS_PATH,
};
