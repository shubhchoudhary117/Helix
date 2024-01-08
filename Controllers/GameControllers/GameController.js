const GameInfoModel = require("../../models/GameInfoModel/GameInfoModel.js");

class GameController {

    // set game information
    static setGameIsStart = async (req, res) => {
        let { gameisstart } = req.body;
        try {
            await GameInfoModel.updateOne({ GameType: "Helix" }, { GameIsStart: gameisstart }, { upsert: true })

            res.json({ result: true, gameinfoUpdated: true, internalServerError: false })
        } catch (error) {
            throw error;
            res.json({ result: false, gameinfoUpdated: false, internalServerError: true })
        }
    }

    // set the game details when aeroplan is crashed
    static setAeroPlanIsCrashed = async (req, res) => {
        let { aeroplancrash } = req.body;
        try {
            await GameInfoModel.updateOne({ GameType: "Helix" }, { AeroplanCrash: aeroplancrash }, { upsert: true })

            res.json({ result: true, gameinfoUpdated: true, internalServerError: false })
        } catch (error) {
            throw error;
            res.json({ result: false, gameinfoUpdated: false, internalServerError: true })
        }
    }
}

module.exports = GameController;