const mongoose=require("mongoose");

const CurrentBetSchema=new mongoose.Schema({
    Email:{
        type:String,
        require:true
    },
    CurrentFirstBetNumber:{
        type:String,
        require:true
    },
    CurrentSecondBetNumber:{
        type:String,
        require:true
    },
    CurrentFirstBettingAmount:{
        type:Number,
        require:true
    },
    CurrentSecondBettingAmount:{
        type:Number,
        require:true
    },
    Bet_time:{
        type:Date,
        require:true,
        default:Date.now
    }
});



const CurrentBetModel=mongoose.model("CurrentBet",CurrentBetSchema);

module.exports=CurrentBetModel;