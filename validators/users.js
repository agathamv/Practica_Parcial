const {check} = require('express-validator');
const handleValidator = require('../utils/handleValidator.js');

const validatorCreateItem = [
    check("email").exists().notEmpty(),
    check("password").exists().notEmpty(),
    handleValidator
];

const validatorGetItem = [
    check("email").exists().notEmpty(),
    handleValidator
];

module.exports = {validatorCreateItem, validatorGetItem};
