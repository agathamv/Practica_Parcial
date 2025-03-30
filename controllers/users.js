const { matchedData } = require("express-validator");
const UserModel = require('../models/users.js');
const bcrypt = require("bcrypt");
const { handleHttpError } = require("../utils/handleError");
const { usersModel } = require("../models");
const { verifyToken, tokenSign } = require("../utils/handleJwt");

const getItem = async (req, res) => {
    try {
        const { email } = matchedData(req);
        const data = await UserModel.findOne({email: email });
        if (!data) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        res.json(data);
    } catch (err) {
        console.error("Error en getItem:", err);
        handleHttpError(res, "Error en la obtención del usuario", 500);
    }
};


const getItems = async (req, res) => {
    try {
        const users = await usersModel.find();

        const data = await Promise.all(users.map(async (user) => {
            const token = await tokenSign(user);
            return {
                email: user.email,
                status: user.status,
                role: user.role,
                codigo: user.codigo,
                token
            };
        }));

        res.json(data);
    } catch (err) {
        console.error("Error en getItems:", err);
        handleHttpError(res, "Error en la obtención de los usuarios", 500);
    }
};

const createItem = async (req, res) => {
    try{
        const body = matchedData(req);
        const hashedPassword = await bcrypt.hash(body.password, 10);
        const verificationCode = Math.floor(100000 + Math.random() * 900000);

        const data = new UserModel({
            email: body.email,
            password: hashedPassword,
            codigo: verificationCode,
            intentos: 3,
            status: false,
            role: "user"
        });

        await data.save();

        res.json(data);
    }catch(err){
        console.error("Error en createItem:", err);
        res.status(500).json({ error: "Error al crear el usuario"}); 
    }
}

const verifyEmail = async (req, res) => {
    try {
        const { code } = matchedData(req);
        const authHeader = req.headers.authorization;
        
        // Verificar si el header de autorización está presente
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return handleHttpError(res, "No se proporcionó token o formato incorrecto", 401);
        }
        
        const token = authHeader.split(" ")[1]; // Extraer el token
        const decoded = await verifyToken(token); // Verificar el token
        
        // Verificar si el token es válido y contiene el _id
        if (!decoded || !decoded._id) {
            return handleHttpError(res, "Token inválido", 401);
        }
        
        // Buscar al usuario en la base de datos usando el _id del token
        const user = await usersModel.findById(decoded._id);
        if (!user) {
            return handleHttpError(res, "Usuario no encontrado", 404);
        }
        
        // Verificar que el código del usuario coincida con el código proporcionado
        if (user.codigo !== code) {
            return handleHttpError(res, "Código incorrecto", 400);
        }
        
        // Cambiar el estado del usuario a "verificado"
        user.status = true;
        await user.save();
        
        // Responder con éxito
        res.json({ message: "Email verificado correctamente" });
    } catch (err) {
        console.error("Error en verifyEmail:", err);
        handleHttpError(res, "Error al verificar el email", 500);
    }
};


const updateItem =  async (req, res) => {
    
    const email = req.params.email;
    const data = await UserModel.findOneAndReplace(
        {email}, 
        req.body, {returnDocument: 'after'});
    res.json(data)
}

const deleteItem = async (req, res) => {
    const data = await UserModel.findOneAndDelete({email: req.params.email})
    res.json(data)
}


module.exports = {getItem, getItems, verifyEmail, updateItem, createItem, deleteItem}