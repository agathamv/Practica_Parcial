const { matchedData } = require("express-validator");
const UserModel = require('../models/users.js');

const getItem = async (req, res) => {
    try {
        const { email } = matchedData(req);
        const data = await UserModel.findOne({email: email }); // Usar "_id" correctamente
        if (!data) {
            return ;
        }
        res.json(data);
    } catch (err) {
        console.error("Error en getItem:", err);
    }
};


const getItems = async (req, res) => {
    try{
        console.log(req);
        const data = await UserModel.find();
        res.send(data);
    }catch(err){
        console.error("Error en getItems:", err);
    }
        
}

const createItem = async (req, res) => {
    try{
        const body = matchedData(req);
        const data = await UserModel.create(body);
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