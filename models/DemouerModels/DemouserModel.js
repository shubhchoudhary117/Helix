const mongoose = require("mongoose");

const demoUserSchema = new mongoose.Schema({
    Username: {
        type: String
    },
    GameId: {
        type: String
    },
    DemoId: {
        type: Number,
        default: 1
    },
    Balance: {
        type: Number,
        default: 20000
    },
    Created_At:{
        type: Date,
        required: true,
        default: Date.now
    }

});

const demoUserModel = mongoose.model("DemouserModel", demoUserSchema);

module.exports = demoUserModel;