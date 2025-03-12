const mongoose = require("mongoose")
const UsersModel = new mongoose.Schema(
    {
        name: {
            type: String
        },
        email: {
            type: String,
            unique: true
        },
        password:{
            type: String 
        },
        codigo:{
            type:Number,
        },
        intentos:{
            type:Number,
        },
        status:{
            type:Boolean,
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