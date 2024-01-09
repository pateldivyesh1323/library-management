import pg from 'pg'
import enviroments from '../enviroments.js';

const Client = pg.Client;

const dbConfig = {
    user: enviroments.db_username,
    host: enviroments.db_host,
    database: enviroments.db_name,
    password: enviroments.db_password,
    port: enviroments.db_port,
};

const client = new Client(dbConfig);

async function setupDatabase() {

    console.log("Starting setting up database....");

    try {
        await client.connect();

        console.log("Creating author table if not exists....");
        await client.query(`
            CREATE TABLE IF NOT EXISTS author (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone_no VARCHAR(50) NOT NULL,
                password VARCHAR(255) NOT NULL
            )
        `);

        console.log("Creating book table if not exists....");
        await client.query(`
                CREATE TABLE IF NOT EXISTS book (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                likes INTEGER[] DEFAULT ARRAY[]::INTEGER[],
                author INTEGER REFERENCES author(id)
            )
        `);

        console.log('Database successfully set!');
    } catch (error) {
        console.error('Error during setup:', error);
    } finally {
        await client.end();
    }
}

setupDatabase();