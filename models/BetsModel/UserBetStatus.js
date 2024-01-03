const mongoose=require("mongoose");

let UserBetStatusModelSchema=new mongoose.Schema({
    Userid:{
        type:String,
        require:true
    },
    FirstBetIsAuto:{
        type:Boolean,
        require:true,
        default:false
    },
    SecondBetIsAuto:{
        type:Boolean,
        require:true,
        default:false
    },
    FirstBetIsAutoCollect:{
        type:Boolean,
        require:true,
        default:false
    },
    SecondBetIsAutoCollect:{
        type:Boolean,
        require:true,
        default:false
    }
})

// create model of this Schema
const UserBetStatusModel=mongoose.model("UserBetStatusModel",UserBetStatusModelSchema);

module.exports=UserBetStatusModel;