const mongoose=require("mongoose");

const CurrentWinBetSchema=new mongoose.Schema({
    Username:{
        type:String,
        require:true,
        trim:true
    },
    Email:{
        type:String,
        require:true
    },
    Betnumber:{
        type:String,
        require:true
    },
    BetAmount:{
        type:Number,
        require:true
    },
    BetOutAmount:{
        type:Number,
        require:true
    },
    win_time:{
        type:Date,
        require:true,
        default:Date.now
    }
});



const CurrentWinBetsModel=mongoose.model("CurrentWinBets",CurrentWinBetSchema);

module.exports=CurrentWinBetsModel;