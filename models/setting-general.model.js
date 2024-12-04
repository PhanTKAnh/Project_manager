const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater')
mongoose.plugin(slug);
const settingGeneralSchema = new mongoose.Schema(
    {
        websiteName: String,
        logo: String,
        phone: String,
        email: String,
        address: String,
        copyright: String
       
    }, {
    timestamps: true
}
);
const SettingGeneral = mongoose.model('SettingGeneral', settingGeneralSchema, "setting-general");

module.exports = SettingGeneral;
