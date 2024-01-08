const LetestTwentyBetsModel = require("../../models/BetsModel/LetestTwentyBetsModel")
const generateBetController = require("../../Controllers/BetControllers/GeneratebetController.js");
const UserBetModel = require("../../models/BetsModel/UserBetModel.js");
const UserBetsHistoryModel = require("../../models/BetsModel/UserBetsHistoryModel.js");
const CurrentBetModel = require("../../models/BetsModel/CurrentBetModel.js")
const DemoUserModel = require("../../models/DemouerModels/DemouserModel.js");
const CurrentWinBetsModel = require("../../models/BetsModel/CurrentWinBets.js");
const UserBetStatusModel = require("../../models/BetsModel/UserBetStatus.js")
const Joi = require("joi")
class BetController {

    static betSchema = Joi.object({
        username: Joi.string().min(3).required(),
        email: Joi.string().min(4),
        betnumber: Joi.required(),
        betamount: Joi.required()
    })
    // on unity frotend send current bet number
    static onPostCurrentBet = async (req, res) => {
        let { currentbet, userid } = req.body;
        try {
            console.log(await CurrentBetModel.find());
            // delete all previous current bets
            await CurrentBetModel.deleteMany();
            // save the current bet in database
            let newBet = new CurrentBetModel({ Email: userid, CurrentBetNumber: currentbet });
            // save the new current bet
            var currentBet = await newBet.save();
            if (currentBet) {
                res.json({ success: true, currentBet: currentBet, somethingwrong: false });
            } else {
                res.json({ success: true, currentBet: currentBet, somethingwrong: true });
            }
        } catch (error) {
            throw error;
            res.json({ success: true, currentBet: currentBet, somethingwrong: false, internalServerError: true });
        }
    }

    // on get user placed bets number
    static onGetUserPlacedBetsNumber = async (req, res) => {
        try {
            let { userid } = req.params;
            let placedBets = await CurrentBetModel.findOne({ Email: userid });
            res.status(200).json({ result: true, placedBetsDetails: placedBets, internalServerError: false })
        } catch (error) {
            console.log(error);
            res.status(200).json({ result: true, placedBetsDetails: placedBets, internalServerError: false })
        }
    }

    // update the user bet satus
    static onUpdateUserBetStatus = async (req, res) => {
        try {
            let { userid, firstBetIsAuto, secondBetIsAuto, firstBetIsAutocCollect, secondBetIsAutoCollect } = req.body;
            let user = await DemoUserModel.findOne({ Username: userid });
            if (user) {
                await UserBetStatusModel.updateOne({ Userid: userid },
                    {
                        FirstBetIsAuto: firstBetIsAuto, SecondBetIsAuto: secondBetIsAuto,
                        FirstBetIsAutoCollect: firstBetIsAutocCollect, SecondBetIsAutoCollect: secondBetIsAutoCollect
                    }, { upsert: true });
                res.status(201).json({ result: true, statusIsUpdated: true, badCredintials: false, internalServerError: false })
            } else {
                res.status(401).json({ result: false, statusIsUpdated: false, badCredintials: true, internalServerError: false })
            }
        } catch (error) {
            throw error;
            res.status(501).json({ result: false, statusIsUpdated: false, badCredintials: false, internalServerError: true })
        }
    }


    // on get specific user bet status
    static onGetUseBetStatus = async (req, res) => {
        try {
            let { userid } = req.params;
            let userBetStatus = await UserBetStatusModel.findOne({ Userid: userid });
            return res.status(200).json({ result: true, betStatus: userBetStatus, somethingwrong: false });
        } catch (error) {
            throw error;
            return res.status(501).json({ result: false, betStatus: null, somethingwrong: false, internalServerError: true });
        }
    }


    //   save the current placed bet wining history
    // let placedBet = await UserBetModel.updateOne(
    //     { Email: email },
    //     { $addToSet: { Bets: [{ Betnumber: betnumber, BetAmount: betamount }] } });
    // When the user place  the first bet
    static onPlaceFirstBet = async (req, res) => {
        // distructure the request body
        let { username, email, betnumber, betamount } = req.body;
        try {

            let { error } = this.betSchema.validate({ username, email, betnumber, betamount });
            if (error) {
                return res.status(400).json({
                    success: false, somethingwrong: true, internalServerError: false,
                    error: error.details[0].message
                });
            }
            else {
                // update the current bet model
                await CurrentBetModel.updateOne({ Email: email },
                    { CurrentFirstBetNumber: betnumber, CurrentFirstBettingAmount: betamount }, { upsert: true })


                // update the placed bet history
                let newWinner = new CurrentWinBetsModel({
                    Username: username,
                    Email: email,
                    Betnumber: betnumber,
                    BetAmount: betamount,
                    BetOutAmount: ""
                })
                // save the placed bet history
                let added = await newWinner.save();

                // update the user balance
                let demouser = await DemoUserModel.findOne({ Username: "Demouser1" });
                let updatedBalance = 0;
                updatedBalance = (parseFloat(demouser.Balance)) - betamount;
                await DemoUserModel.updateOne({ Username: "Demouser1" }, { Balance: updatedBalance });
                // update the balance and send the response
                res.json({ success: true, somethingwrong: false });
            }

        } catch (error) {
            throw error;
            res.json({ success: false, somethingwrong: false, internalServerError: true });
        }
    }




    // When the user place the second bet
    static onPlaceSecondBet = async (req, res) => {
        // distructure the request body
        let { username, email, betnumber, betamount } = req.body;
        try {

            //   save the current placed bet wining history
            // let placedBet = await UserBetModel.updateOne(
            //     { Email: email },
            //     { $addToSet: { Bets: [{ Betnumber: betnumber, BetAmount: betamount }] } });

            // update the current bet
            await CurrentBetModel.updateOne({ Email: email },
                { CurrentSecondBetNumber: betnumber, CurrentSecondBettingAmount: betamount }, { upsert: true })


            // update the placed bet history
            let newWinner = new CurrentWinBetsModel({
                Username: username,
                Email: email,
                Betnumber: betnumber,
                BetAmount: betamount,
                BetOutAmount: ""
            })
            // save the placed bet history
            let added = await newWinner.save();

            // update the user balance
            let demouser = await DemoUserModel.findOne({ Username: "Demouser1" });
            let updatedBalance = 0;
            updatedBalance = (parseFloat(demouser?.Balance)) - betamount;
            await DemoUserModel.updateOne({ Username: "Demouser1" }, { Balance: updatedBalance });

            res.json({ success: true, somethingwrong: false });

        } catch (error) {
            throw error;
            res.json({ success: false, somethingwrong: false, internalServerError: true });
        }
    }




    // on Bet Result on first bet win
    static onFirstBetWin = async (req, res) => {
        let { email, betnumber, winingstatus, lossamount, winamount } = req.body;
        try {
            var currentBetModel = await CurrentBetModel.findOne({ Email: email });
            // const userBet = await UserBetModel.findOne({
            //     Bets: {
            //         $elemMatch:
            //             { Betnumber: currentBetModel.CurrentFirstBetNumber }
            //     }
            // });
            /*
               save the user placed bet history in data base for some time until game is close
               after game is closed we are deleted all current placed historis 
             */
            if (currentBetModel.CurrentFirstBetNumber) {
                await CurrentWinBetsModel.updateOne(
                    { Betnumber: currentBetModel.CurrentFirstBetNumber }, { BetOutAmount: winamount })
                /*
                    save the user bet history permanent  in our database becouse if user show own history
                    so we are send all history releted game and authenticate user
                */

                // if user have histories so we are add a new wining history
                await UserBetsHistoryModel.updateOne({ Email: email },
                    {
                        $push: {
                            BetHistory:
                                [{
                                    Betnumber: currentBetModel.CurrentSecondBetNumber,
                                    BetAmount: currentBetModel.CurrentFirstBettingAmount,
                                    WiningStatus: winingstatus,
                                    LossAmount: lossamount, WinAmount: winamount
                                }]
                        }
                    }, { upsert: true });

                // update the user balance
                let demouser = await DemoUserModel.findOne({ Username: "Demouser1" });
                let updatedBalance = 0;
                let winHistory = winingstatus;
                if (winHistory === "win") {
                    updatedBalance = (parseFloat(demouser.Balance)) + (parseFloat(winamount));
                } else {
                    updatedBalance = (parseFloat(demouser.Balance)) - (parseFloat(winamount));
                }
                await DemoUserModel.updateOne({ Username: "Demouser1" }, { Balance: updatedBalance });
                res.json({ success: true, somethingwrong: false });

            } else {
                console.log("not founded")
                res.json({ success: false, history: null, somethingwrong: true })
            }
        } catch (error) {
            console.log(error)
            res.json({ success: false, history: null, somethingwrong: false, internalServerError: true })
        }
    }


    // on Bet Result 
    static onSecondBetWin = async (req, res) => {
        let { email, betnumber, winingstatus, lossamount, winamount } = req.body;
        try {
            var currentBetModel = await CurrentBetModel.findOne({ Email: email });
            /*
               save the user placed bet history in data base for some time until game is close
               after game is closed we are deleted all current placed historis 
             */
            if (currentBetModel.CurrentSecondBetNumber) {
                await CurrentWinBetsModel.updateOne(
                    { Betnumber: currentBetModel.CurrentSecondBetNumber }, { BetOutAmount: winamount })
                /*
                    save the user bet history permanent  in our database becouse if user show own history
                    so we are send all history releted game and authenticate user
                */
                // if user have histories so we are add a new wining history
                await UserBetsHistoryModel.updateOne({ Email: email },
                    {
                        $push: {
                            BetHistory:
                                [{
                                    Betnumber: currentBetModel.CurrentSecondBetNumber,
                                    BetAmount: currentBetModel.CurrentSecondBettingAmount,
                                    WiningStatus: winingstatus,
                                    LossAmount: lossamount, WinAmount: winamount
                                }]
                        }
                    }, { upsert: true });

                // update the user balance
                let demouser = await DemoUserModel.findOne({ Username: "Demouser1" });
                let updatedBalance = 0;
                let winHistory = winingstatus;
                if (winHistory === "win") {
                    updatedBalance = (parseFloat(demouser.Balance)) + (parseFloat(winamount));
                } else {
                    updatedBalance = (parseFloat(demouser.Balance)) - (parseFloat(winamount));
                }
                await DemoUserModel.updateOne({ Username: "Demouser1" }, { Balance: updatedBalance });
                res.json({ success: true, somethingwrong: false });
            } else {
                console.log("not founded")
                res.json({ success: false, history: null, somethingwrong: true })
            }
        } catch (error) {
            console.log(error)
            res.json({ success: false, history: null, somethingwrong: false, internalServerError: true })
        }
    }

    // on get all placed bet wining history
    static onGetAllPlacedBetWinHistory = async (req, res) => {
        try {
            let placedWins = await CurrentWinBetsModel.find().sort({ win_time: -1 });
            return res.json({ success: true, wins: placedWins, somethingwrong: false })
        } catch (error) {
            console.log(error);
            return res.json({ success: false, wins: null, somethingwrong: false, internalServerError: true })
        }
    }

    // on get only user placed bet win hisotry
    static onGetMyPlacedBetWinHistory = async (req, res) => {
        let { userid } = req.params;
        try {
            let placedWins = await CurrentWinBetsModel.find({ Email: userid }).sort({ win_time: -1 });
            return res.json({ success: true, wins: placedWins, somethingwrong: false })
        } catch (error) {
            console.log(error);
            return res.json({ success: false, wins: null, somethingwrong: false, internalServerError: true })
        }
    }

    // on get all placed bets
    static getAllPlacedBets = async (req, res) => {
        try {
            let placedBets = await UserBetModel.find();
            return res.json({ success: true, placedbets: placedBets, somethingwrong: false });
        } catch (error) {
            throw error;
            return res.json({ success: true, placedbets: null, somethingwrong: false, internalServerError: true });

        }
    }

    // get Bet Id's of User
    static onMyBets = async (req, res) => {
        try {
            let { userid } = req.params;

            let myBets = await UserBetModel.findOne({ Email: userid });

            if (myBets) {
                res.json({ success: true, placedBets: myBets, somethingwrong: false })
            } else {
                res.json({ success: false, placedBets: null, somethingwrong: true })
            }
        } catch (error) {
            console.log(error)
            res.json({ success: false, placedBets: null, somethingwrong: false, internalServerError: true })
        }
    }

    // on  get my bet histories
    static onGetMyBetHistories = async (req, res) => {
        try {
            let { userid } = req.params;
            let myHistories = await UserBetsHistoryModel.findOne({ Email: userid });
            res.json({ success: true, betHistories: myHistories, somethingwrong: false })
        } catch (error) {
            throw error;
            res.json({ success: true, betHistories: myHistories, somethingwrong: false, internalServerError: true })
        }
    }

    // on get all user bet histories
    static onGetAllBetHistories = async (req, res) => {
        try {
            let allHistories = await UserBetsHistoryModel.find();
            res.json({ success: true, betHistories: allHistories, somethingwrong: false })
        } catch (error) {
            throw error;
            res.json({ success: true, betHistories: allHistories, somethingwrong: false, internalServerError: true })
        }
    }

    // get top 50 bets

    // get all bet histories
    static getAllBets = async (req, res) => {
        try {
            let totalBets = await LetestTwentyBetsModel.find();

            let bets = totalBets[0].bets;
            res.json({ success: true, bets: totalBets, somethingwrong: false })
        }
        catch (error) {
            throw error;
            res.json({ success: false, bets: null, somethingwrong: false, internalServerError: true })
        }
    }

    // get top 50 bets
    static getTop50Bets = (req, res) => {
        try {
            let betNumbers = generateBetController.generateNumbers();
            //extract top 50 bet numbers from ganerated bets 
            let topBets = betNumbers.slice(0, 51);
            res.json({ success: true, topbets: topBets, somethingwrong: false })
        } catch (error) {
            throw error;
            res.json({ success: false, topbets: null, somethingwrong: false, internalServerError: true })
        }
    }
}


module.exports = BetController;