import db_client from "../database/index.js";
import query from "../queries/index.js";
import { encryptPassword, generateToken, getIdFromToken, matchPassword } from "../utils/helper.js";

const registerAuthor = async (req, res) => {
    try {
        const { name, email, phone_no, password } = req.body;
        if (!name || !email || !phone_no || !password) {
            return res.status(400).send("Please provide all credentials");
        }

        const userExists = await db_client.query(query.getAuthorByEmail, [email]);
        if (userExists.rows.length !== 0) {
            return res.status(400).send("User already exists");
        }

        const newPass = await encryptPassword(password);
        const user = await db_client.query(query.createNewUser, [name, email, phone_no, newPass]);
        if (user) {
            const { id, name, email, phone_no } = user.rows[0];
            return res.status(200).json({ id, name, email, phone_no, token: generateToken(id) });
        }
        else {
            return res.status(400).send("Failed to create user");
        }

    } catch (error) {
        return res.status(500).send("Internal server error");
    }
}

const loginAuthor = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send("Please provide alll credentials");
        }
        const data = await db_client.query(query.getAuthorByEmail, [email]);
        const user = data.rows[0];
        if (user && matchPassword(password, user.password)) {
            return res.status(200).json({
                id: user.id,
                name: user.name,
                email: user.email,
                phone_no: user.phone_no,
                token: generateToken(user.id)
            })
        }
        else {
            return res.status(401).send("Invalid user crendentials!");
        }
    } catch (error) {
        return res.status(500).send("Internal server error");
    }
}

const getAllAuthors = async (req, res) => {
    try {
        const data = await db_client.query(query.getAllAuthorsWithNoOfBooks);
        const authors = data.rows;
        return res.status(200).json(authors);
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal server error");
    }
}

const getOneAuthor = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await db_client.query(query.getAuthorWithIDWithBooksPublished, [id]);
        const author = data.rows[0];
        if (author) {
            return res.status(200).json(author);
        }
        else {
            return res.status(401).send("Author not found");
        }
    } catch (error) {
        return res.status(500).send("Invalid ID");
    }
}

const getCurrentAuthor = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const id = getIdFromToken(token);
        const data = await db_client.query(query.getAuthorWithIDWithBooksPublished, [id]);
        const author = data.rows[0];
        if (author) {
            return res.status(200).json(author);
        }
    } catch (error) {
        return res.status(500).send("Internal server error");
    }
}

const updateAuthor = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const id = getIdFromToken(token);
        const { name: nameToUpdate, phone_no: phone_noToUpdate } = req.body;
        const data = await db_client.query(query.getAuthorWithID, [id]);
        const { name, phone_no } = data.rows[0];
        const updatedData = await db_client.query(query.updateAuthor, [nameToUpdate || name, phone_noToUpdate || phone_no, id]);
        const updatedAuthor = updatedData.rows[0];
        return res.status(200).json(updatedAuthor);
    } catch (error) {
        return res.status(500).send("Internal server error");
    }
}

const deleteAuthor = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const id = getIdFromToken(token);
        await db_client.query(query.deleteAuthor, [id]);
        return res.status(200).json("Author deleted successfully!");
    } catch (error) {
        return res.status(500).send("Internal server error");
    }
}

export { registerAuthor, loginAuthor, getAllAuthors, getOneAuthor, getCurrentAuthor, updateAuthor, deleteAuthor };