const mongoose = require("mongoose")
const UsersModel = new mongoose.Schema(
    {
        email: {
            type: String,
            unique: true
        },
        password:{
            type: String 
        },
        codigo:{ //codigo de verificacion
            type:Number,
        },
        intentos:{ //intentos de verificacion
            type:Number,
            default: 0
        },
        status:{ //estado de verificacion
            type:Boolean,
            default: false
        },
        role:{
            type: ["user", "admin"],
            default: "user"
        }

    },
    {
        timestamps: true,
        versionKey: false
    }
)

module.exports = mongoose.model("users", UsersModel) 