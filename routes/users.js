const express = require('express')
const {getItem, getItems, updateItem, createItem, deleteItem} = require ('../controllers/users.js')


const {validatorCreateItem, validatorGetItem} = require("../validators/users");

const router = express.Router();

router.get('/:email', validatorGetItem, getItem);
router.get('/', getItems);
router.post("/", validatorCreateItem, createItem);
router.put('/:email', validatorGetItem, updateItem);
router.delete('/:email', validatorGetItem, deleteItem);

module.exports = router;