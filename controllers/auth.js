const {handleHttpError} = require("../utils/handleError")
const {matchedData} = require("express-validator")
const {encrypt} = require("../utils/handlePassword")
const {usersModel} = require("../models")
const {tokenSign} = require("../utils/handleJwt")


const registerCtrl = async (req, res) => {
    try {
        req = matchedData(req)
        const password = await encrypt(req.password)
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
        const body = {...req, password, codigo: verificationCode}
        const dataUser = await usersModel.create(body)
        dataUser.set("password", undefined, {strict:false})

        const token = await tokenSign(dataUser);

        const response = {
            token,
            user: {
                email: dataUser.email,
                status: dataUser.status,
                role: dataUser.role,
                codigo: dataUser.codigo
            }
        };

        res.json(response)
    }catch(err){
        console.log(err)
        handleHttpError(res, "ERROR_REGISTER_USER")
    }
}



module.exports = {registerCtrl}