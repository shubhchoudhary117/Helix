const express=require("express");
const router=express.Router();
const generateBetController=require("../../Controllers/BetControllers/GeneratebetController.js")
const betController=require("../../Controllers/BetControllers/BetController.js")

router.post("/placefirstbet",betController.onPlaceFirstBet);
router.post("/placesecondbet",betController.onPlaceSecondBet);
router.post("/firstbet-win",betController.onFirstBetWin)
router.post("/secondbet-win",betController.onSecondBetWin)
router.get("/bet-number",generateBetController.getBetNumber);
router.get("/allbets",betController.getAllBets)
router.get("/top50",betController.getTop50Bets)
router.get("/mybets/:userid",betController.onMyBets);
router.get("/mybethistory/:userid",betController.onGetMyBetHistories);
router.get("/allbethistories",betController.onGetAllBetHistories);
router.post("/current-bet",betController.onPostCurrentBet);
router.get("/allplaced-bets",betController.getAllPlacedBets);
router.get("/myplaced-bets/:userid",betController.onGetMyPlacedBetWinHistory)
router.get("/currentbet-winers",betController.onGetAllPlacedBetWinHistory);
router.post("/set-betstatus",betController.onUpdateUserBetStatus)
router.get("/mybet-status/:userid",betController.onGetUseBetStatus);
router.get("/get-userplaced-betsnumber/:userid",betController.onGetUserPlacedBetsNumber)
module.exports=router