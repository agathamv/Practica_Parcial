const express = require('express')
const {getItem, getItems, updateItem, createItem, deleteItem} = require ('../controllers/users.js')


const {validatorCreateItem, validatorGetItem} = require("../validators/users");

const userRouter = express.Router();

userRouter.get('/:email', validatorGetItem, getItem);
userRouter.get('/', getItems);
userRouter.post("/", validatorCreateItem, createItem);
userRouter.put('/:email', (req, res) => {
    console.log(req.params);
    updateItem(req, res);
});
userRouter.delete('/:email', deleteItem);

module.exports = userRouter;