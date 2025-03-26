const { matchedData } = require("express-validator");
const UserModel = require('../models/users.js');
const bcrypt = require("bcrypt");
const { handleHttpError } = require("../utils/handleError");

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
    try{
        //console.log(req);
        const data = await UserModel.find();
        res.json(data);
    }catch(err){
        console.error("Error en getItems:", err);
        handleHttpError(res, "Error en la obtención de los usuarios", 500);
    }
        
}

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


module.exports = {getItem, getItems, updateItem, createItem, deleteItem}