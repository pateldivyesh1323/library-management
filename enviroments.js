import dotenv from 'dotenv';

dotenv.config();

const enviroments = {
    db_username: process.env.DB_USERNAME,
    db_host: process.env.DB_HOST,
    db_name: process.env.DB_NAME,
    db_password: process.env.DB_PASSWORD,
    db_port: process.env.DB_PORT,
    jwt_token: process.env.JWT_TOKEN,
};

export default enviroments;