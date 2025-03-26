const { check } = require("express-validator")
const { usersModel } = require("../models");
const { handleHttpError } = require("../utils/handleError");
const validateResults = require("../utils/handleValidators")

const validatorRegister = [
    check("email").exists().notEmpty().isEmail().custom(async (email) => {
        const existingUser = await usersModel.findOne({ email, status: true }); // Solo emails verificados
        if (existingUser) {
            const error = new Error("El email ya está registrado y verificado");
            error.status = 409; 
            throw error;
        }
    }),
    check("password").exists().notEmpty().isLength( {min:8, max: 16} ),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
]

/*const validatorLogin = [
    check("email").exists().notEmpty().isEmail(),
    check("password").exists().notEmpty().isLength( {min:8, max: 16} ),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
]*/

module.exports = { validatorRegister }