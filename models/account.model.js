const mongoose = require("mongoose");
const generate = require("../helpers/generate");
const accountSchema = new mongoose.Schema(
    {
        fulname: String,
        email: String,
        password: String,
        token: {
            type:String,
            default:generate.generateRandomString(20)
        },
        status: String,
        position: Number,
        phone: String,
        avatar: String,
        role_id: String,
        status: String,
        deleted: {
            type: Boolean,
            default: false
        },
        deleteAt: Date

    }, {
    timestamps: true
}
);
const Account = mongoose.model('Account', accountSchema, "account");

module.exports = Account;
