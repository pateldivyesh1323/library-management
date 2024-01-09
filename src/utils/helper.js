import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import enviroments from '../../enviroments.js';


const encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const newPass = await bcrypt.hash(password, salt);
    return newPass;
}

const matchPassword = async (enteredPassword, password) => {
    return await bcrypt.compare(enteredPassword, password);
}

const generateToken = (id) => {
    return jwt.sign({ id }, enviroments.jwt_token, { expiresIn: "30d" });
}

const getIdFromToken = (token) => {
    token = token.split(" ")[1];
    let decoded = jwt.verify(token, enviroments.jwt_token);
    return decoded.id;
}

export { getIdFromToken, encryptPassword, generateToken, matchPassword };