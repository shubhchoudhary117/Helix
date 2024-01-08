const mongoose = require("mongoose");

const GameInfoModelSchema = new mongoose.Schema({
    GameType:{
        type:String,
        default:"Helix"
    },
    GameIsStart: {
        type: Boolean,
        require: true,
        default: false
    },
    start_time: {
        type: Date,
        require: true,
        default: Date.now
    }
}
)

// create Model of this schema
let GameInfoModel=mongoose.model("GameInfoModel",GameInfoModelSchema);

// exports GameInfoModel
module.exports=GameInfoModel;