import query from "../queries/index.js";
import db_client from "../database/index.js"
import { getIdFromToken } from "../utils/helper.js";

const isUserOwner = async (userId, bookId) => {
    const result = await db_client.query(query.getBookWithID, [bookId]);
    const book = result.rows[0];
    return book.author == userId;
}

const bookExists = async (bookId) => {
    const result = await db_client.query(query.getBookWithID, [bookId]);
    const book = result.rows[0];
    return book;
}

const alreadyLiked = async (userId, bookId) => {
    const result = await db_client.query(query.checkUserLike, [bookId, userId]);
    const book = result.rows[0];
    return book;
}

const getAll = async (req, res) => {
    try {
        const { page, sort } = req.query;
        let searchQuery;
        switch (sort) {
            case "max":
                searchQuery = query.getBooksWithMaxLikes;
                break;
            case "min":
                searchQuery = query.getBooksWithMinLikes;
                break;
            default:
                searchQuery = query.getAllBooks;
                break;
        }
        const result = await db_client.query(searchQuery, [page || 1]);
        const books = result.rows;
        return res.status(200).json(books);
    } catch (error) {
        console.log(error);
        return res.status(500).json("Internal server error")
    }
}

const getOne = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db_client.query(query.getBookWithID, [id]);
        const book = result.rows[0];
        if (book) {
            return res.status(200).json(book);
        }
        else {
            return res.status(400).send("Book not found");
        }
    } catch (error) {
        return res.status(500).json("Internal server error")
    }
}

const createNew = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const id = getIdFromToken(token);
        const { title } = req.body;
        if (!title) {
            return res.status(400).send("Please provide title for book");
        }
        const result = await db_client.query(query.createNewBook, [title, id]);
        const newBook = result.rows[0];
        return res.status(200).json(newBook);
    } catch (error) {
        return res.status(500).json("Internal server error")
    }
}

const updateBook = async (req, res) => {
    try {
        const { id } = req.params;
        const { title } = req.body;
        const authorId = await getIdFromToken(req.headers.authorization);
        const bookExist = await bookExists(id);
        if (!bookExist) {
            return res.status(401).json("Book not found!");
        }
        const checkOwner = await isUserOwner(authorId, id)
        if (!checkOwner) {
            return res.status(403).json("You are not the owner of the book");
        }
        if (!title) {
            return res.status(400).json("Please provide title to update");
        }
        const result = await db_client.query(query.updateBook, [title, id]);
        const updatedBook = result.rows[0];
        return res.status(200).json(updatedBook);
    } catch (error) {
        return res.status(500).json("Internal server error")
    }
}

const deleteBook = async (req, res) => {
    try {
        const { id } = req.params;
        const authorId = await getIdFromToken(req.headers.authorization);
        const bookExist = await bookExists(id);
        if (!bookExist) {
            return res.status(401).json("Book not found!");
        }
        const checkOwner = await isUserOwner(authorId, id)
        if (!checkOwner) {
            return res.status(403).json("You are not the owner of the book");
        }
        await db_client.query(query.deleteBook, [id]);
        return res.status(200).json("Book deleted successfully");
    } catch (error) {
        return res.status(500).json("Internal server error")
    }
}

const likeBook = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = await getIdFromToken(req.headers.authorization);
        const bookExist = await bookExists(id);
        if (!bookExist) {
            return res.status(401).json("Book not found!");
        }
        const liked = await alreadyLiked(userId, id);
        if (liked) {
            return res.status(400).json("Already liked");
        }
        const result = await db_client.query(query.addUserLike, [userId, id]);
        const data = result.rows[0];
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(500).json("Internal server error")
    }
}

const unlikeBook = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = await getIdFromToken(req.headers.authorization);
        const bookExist = await bookExists(id);
        if (!bookExist) {
            return res.status(401).json("Book not found!");
        }
        const liked = await alreadyLiked(userId, id);
        if (liked) {
            const result = await db_client.query(query.unlikeBook, [userId, id]);
            const book = result.rows[0];
            return res.status(200).json(book);
        }
        else {
            return res.status(400).json("YOu have not liked the book!");
        }
    } catch (error) {
        return res.status(500).json("Internal server error")
    }
}

export { getAll, getOne, createNew, updateBook, deleteBook, likeBook, unlikeBook };