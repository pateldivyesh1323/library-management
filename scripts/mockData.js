import pg from 'pg';
import { faker } from '@faker-js/faker';
import enviroments from '../enviroments.js';
import { encryptPassword } from '../src/utils/helper.js';

const { Client } = pg;

const dbConfig = {
    user: enviroments.db_username,
    host: enviroments.db_host,
    database: enviroments.db_name,
    password: enviroments.db_password,
    port: enviroments.db_port,
};

const client = new Client(dbConfig);

function generateUniqueLikes(totalAuthors) {
    const uniqueLikes = [];
    const randomLikeCount = faker.number.int({ min: 1, max: totalAuthors })
    while (uniqueLikes.length < randomLikeCount) {
        const randomAuthorId = faker.number.int({ min: 1, max: totalAuthors });
        if (!uniqueLikes.includes(randomAuthorId)) {
            uniqueLikes.push(randomAuthorId);
        }
    }
    return uniqueLikes;
}

async function generateFakeData() {
    console.log("Generating mock data....")
    try {
        await client.connect();

        console.log("Generating author mocks....")
        for (let i = 0; i < 10; i++) {
            const authorData = {
                name: faker.person.fullName(),
                email: faker.internet.email(),
                phone_no: faker.phone.number(),
                password: await encryptPassword(faker.internet.password()),
            };
            await client.query(`
                INSERT INTO author (name, email, phone_no, password)
                VALUES ($1, $2, $3, $4)
            `, [authorData.name, authorData.email, authorData.phone_no, authorData.password]);
        }

        const { rows: authorCount } = await client.query('SELECT COUNT(*) FROM author');
        const totalAuthors = parseInt(authorCount[0].count, 10);

        console.log("Generating book mocks....")
        for (let i = 0; i < 20; i++) {
            const likes = generateUniqueLikes(totalAuthors);
            const bookData = {
                title: faker.lorem.words(),
                likes,
                author_id: faker.number.int({ min: 1, max: totalAuthors }),
            };

            await client.query(`
                    INSERT INTO book (title, likes, author)
                    VALUES ($1, $2, $3)
            `, [bookData.title, bookData.likes, bookData.author_id]);
        }

        console.log('Mock data generated successfully!');
    } catch (error) {
        console.error('Error generating fake data:', error);
    } finally {
        await client.end();
    }
}

generateFakeData();