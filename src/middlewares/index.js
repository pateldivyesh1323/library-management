import jwt from 'jsonwebtoken';
import enviroments from '../../enviroments.js';
import db_client from '../database/index.js';
import query from '../queries/index.js';

const protect = async (req, res, next) => {
    if (req.headers.authorization) {
        try {
            let token = req.headers.authorization;
            token = token.split(" ")[1];
            let decoded = jwt.verify(token, enviroments.jwt_token);
            const data = await db_client.query(query.getAuthorWithID, [decoded.id]);
            const author = data.rows[0];
            if (author) {
                next();
            }
            else {
                return res.status(401).send("Invalid token");
            }
        } catch (error) {
            res.status(401).send("Invalid token");
        }
    }
    else {
        res.status(401).send("Unauthorized");
    }
}

export { protect };