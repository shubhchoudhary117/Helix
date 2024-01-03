const mongoose=require("mongoose");

const UserBetsHistoryModelSchema=new mongoose.Schema({
    Username:{
        type:String
    },
    Email:{
        type:String,
        require:true
    },
    BetHistory:{
        type:[
            {
                Betnumber:{
                    type:String,
                    require:true
                },
                BetAmount:{
                    type:String,
                    require:true
                },
                WinAmount:{
                    type:String,
                    require:true
                },
                LossAmount:{
                    type:String,
                    require:true
                },
                WiningStatus:{
                    type:"String",
                    require:true
                },
                WiningTime:{
                    type:Date,
                    default:Date.now,
                    require:true
                }
            }
        ],
        
    },
    Winning_time:{
        type:Date,
        require:true,
        default:Date.now
    }
});


const UserBetsHistoryModel=mongoose.model("UserBetsHistoryModel",UserBetsHistoryModelSchema);

module.exports=UserBetsHistoryModel;