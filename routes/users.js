const express = require('express')
const {getItem, getItems, verifyEmail, updateItem, createItem, deleteItem, updateLogoCtrl} = require ('../controllers/users.js')


const {validatorCreateItem, validatorGetItem, validatorValidateCode} = require("../validators/users");

const router = express.Router();

router.get('/:email', validatorGetItem, getItem);
router.get('/', getItems);
router.post("/", validatorCreateItem, createItem);
router.put("/verify", validatorValidateCode, verifyEmail); 
router.patch("/logo", updateLogoCtrl);

router.put('/:email', validatorGetItem, updateItem);
router.delete('/:email', validatorGetItem, deleteItem);

module.exports = router;


