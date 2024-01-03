const LetestTwentyBetsModel = require("../../models/BetsModel/LetestTwentyBetsModel")
class GenerateBetController {
    static count = 1;

    // generate Number between given range
    static generateNumbers() {
        const generateInRange = (min, max, count) =>
            Array.from({ length: count }, () =>
                (Math.random() * (max - min) + min).toFixed(2)
            );

        const numbers = [
            ...generateInRange(0.5, 1.9, 60),
            ...generateInRange(2, 2.5, 25),
            ...generateInRange(10, 10.9, Math.floor(0.025 * 100)),
            ...generateInRange(5, 6, 5),
            ...generateInRange(12, 12.5, Math.floor(0.015 * 100)),
            ...Array(3).fill('15X'),
            ...generateInRange(15.1, 20, Math.floor(0.002 * 100)).map((num) => num + 'X'),
        ];
        return numbers;
    }

    //get bet number
    static getBetNumber = async (req, res) => {
        try {
            // generate all bets respectively demanded bet for helix game
            let ganeratedBets = this.generateNumbers();
           
            // get random bet index from generated bet
            let index = Math.floor(Math.random() * ganeratedBets.length);
            console.log(index)
            // get random bet from generated bets array
            let bet = ganeratedBets[index];
            // get all bets from database 
            let bets = await LetestTwentyBetsModel.find();
            if (bets.length!=0) {
               if(bets[0].bets.length>19){
                // delete previous old bet 
                await LetestTwentyBetsModel.updateOne({_id:bets[0]._id},{$pop:{bets:-1}});
                // add new bet
                await LetestTwentyBetsModel.updateOne({ _id: bets[0]._id }, { $addToSet: { bets: bet } });
                res.json({success:true,somethingwrong:false,currentBet:bet});
               }else{
                // when stored total bets is less than 20 so we are add a bet
                await LetestTwentyBetsModel.updateOne({ _id: bets[0]._id }, { $addToSet: { bets: bet } });
                res.json({success:true,somethingwrong:false,currentBet:bet});
               }
            }else{
                // when bets is empty then we are create bet and save it
                let newBet=new LetestTwentyBetsModel({bets:bet});
                await newBet.save();
                res.json({success:true,somethingwrong:false,currentBet:bet});
            }
        } catch (error) {
            console.log(error);
            res.json({success:false,somethingwrong:true,currentBet:null});
        }
    }
}

module.exports = GenerateBetController;