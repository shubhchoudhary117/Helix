const mongoose=require("mongoose");

const LetestTwentyBetsModelSchema=new mongoose.Schema({
  
    bets:{
       type:[]
    },
})

const LetestTwentyBetsModel=mongoose.model("LetestTwentyBetsModel",LetestTwentyBetsModelSchema);

module.exports=LetestTwentyBetsModel;