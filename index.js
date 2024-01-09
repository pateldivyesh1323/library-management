import express from 'express';
import authorRoutes from './src/routes/authorRoutes.js';
import booksRoutes from './src/routes/booksRoutes.js';

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send("<h3>Welcome to backend server<h3>");
})

app.use('/api/authors', authorRoutes);
app.use('/api/books', booksRoutes);

app.listen(PORT, () => {
    console.log(`App listening on : http://localhost:${PORT}`);
})