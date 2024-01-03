const mongoose=require("mongoose");

const UserBetModelSchema=new mongoose.Schema({
    Username:{
        type:String,
        require:true
    },
    Email:{
        type:String,
        require:true
    },
    Bets:{
        type:[{
            Betnumber:{
                type:String,
                require:true,
                trim:true
            },
            BetAmount:{
                type:Number,
                require:true,
                trim:true
            }
        }],
        require:true
    },
    Bet_placing_time:{
        type:Date,
        default:Date.now
    }
});


const UserBetModel=mongoose.model("UserBetModel",UserBetModelSchema);

module.exports=UserBetModel;