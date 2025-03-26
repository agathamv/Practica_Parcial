const {check} = require('express-validator');
const handleValidator = require('../utils/handleValidators.js');

const validatorCreateItem = [
    check("email").exists().notEmpty(),
    check("password").exists().notEmpty(),
    handleValidator
];

const validatorGetItem = [
    check("email").exists().notEmpty().isEmail().withMessage("Debe ser un email válido"),
    handleValidator
];

module.exports = {validatorCreateItem, validatorGetItem};
