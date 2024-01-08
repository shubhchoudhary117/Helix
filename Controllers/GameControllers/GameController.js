const GameInfoModel=require("../../models/GameInfoModel/GameInfoModel.js");

class GameController{

    static setGameIsStart=async(req,res)=>{
        let {gameisstart}=req.body;
        try{
            let newGameInfo=new GameInfoModel({GameIsStart:gameisstart});
           let savedGameInfo=await newGameInfo.save();
            res.json({result:true,gameinfo:savedGameInfo,internalServerError:false})
        }catch(error){
            throw error;
            res.json({result:false,gameinfo:null,internalServerError:true})
        }
    }
}

module.exports=GameController;