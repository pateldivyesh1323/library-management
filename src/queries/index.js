const query = {
    getAllAuthors: "SELECT id, name, email, phone_no FROM author",
    getAllAuthorsWithNoOfBooks: "SELECT author.id, author.name, author.email, author.phone_no, COUNT(book.id) AS num_of_books_published FROM author LEFT JOIN book ON author.id = book.author GROUP BY author.id, author.name",
    getAuthorByEmail: "SELECT id, name, email, phone_no FROM author WHERE email = $1",
    getAuthorWithID: "SELECT id, name, email, phone_no FROM author WHERE id = $1",
    getAuthorWithIDWithBooksPublished: "SELECT author.id, author.name, author.email, author.phone_no, COUNT(book.id) AS num_books_published, ARRAY_AGG(book.title) AS books_published FROM author LEFT JOIN book ON author.id = book.author WHERE author.id = $1 GROUP BY author.id, author.name, author.email, author.phone_no",
    createNewUser: "INSERT INTO author (name, email, phone_no, password) VALUES ($1, $2, $3, $4) RETURNING id, name, email, phone_no",
    deleteAuthor: "DELETE FROM author WHERE id = $1",
    updateAuthor: "UPDATE author SET name = $1, phone_no = $2 WHERE id = $3 RETURNING id, email, name, phone_no",
    getAllBooks: "SELECT * FROM book ORDER BY id LIMIT 10 OFFSET ($1 - 1) * 10",
    getBooksWithMaxLikes: "SELECT b.id, b.title, b.author, COUNT(DISTINCT b.likes) AS num_likes FROM book b GROUP BY b.id, b.title, b.author ORDER BY num_likes DESC LIMIT 10 OFFSET ($1 - 1) * 10",
    getBooksWithMinLikes: "SELECT b.id, b.title, b.author, COUNT(DISTINCT b.likes) AS num_likes FROM book b GROUP BY b.id, b.title, b.author ORDER BY num_likes LIMIT 10 OFFSET ($1 - 1) * 10",
    getBookWithID: "SELECT * FROM book WHERE id = $1",
    createNewBook: "INSERT INTO book (title, author) VALUES ($1, $2) RETURNING *",
    updateBook: "UPDATE book SET title = $1 WHERE id = $2 RETURNING *",
    deleteBook: "DELETE FROM book WHERE id = $1",
    checkUserLike: "SELECT * FROM book WHERE id = $1 AND $2 = ANY(likes)",
    addUserLike: "UPDATE book SET likes = array_append(likes, $1) WHERE id = $2 RETURNING *",
    unlikeBook: "UPDATE book SET likes = array_remove(likes, $1) WHERE id = $2 RETURNING *",
}

export default query;