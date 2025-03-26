const express = require("express")
const { matchedData } = require("express-validator")
const { encrypt } = require("../utils/handlePassword")
const {usersModel} = require("../models")
const router = express.Router()
const {validatorRegister} = require("../validators/auth")
const { registerCtrl } = require("../controllers/auth")
const { tokenSign } = require("../utils/handleJwt")

// Posteriormente, llevaremos la lógica al controller
router.post("/register", validatorRegister, registerCtrl, async (req, res) => {
    req = matchedData(req)
    const password = await encrypt(req.password)
    const body = {...req, password} // Con "..." duplicamos el objeto y le añadimos o sobreescribimos una propiedad
    const dataUser = await usersModel.create(body)
    dataUser.set('password', undefined, { strict: false })
    const data = {
        token: await tokenSign(dataUser),
        user: dataUser
    }
    res.send(data)
})

module.exports = router