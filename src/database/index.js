import pg from 'pg'
import enviroments from '../../enviroments.js'

const Client = pg.Client;

const db_client = new Client({
    user: enviroments.db_username,
    host: enviroments.db_host,
    database: enviroments.db_name,
    password: enviroments.db_password,
    port: enviroments.db_port,
})

db_client.connect((err) => {
    if (!err) {
        console.log("Successfully connected to database.");
    }
});

export default db_client;