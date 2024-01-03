const generateUniqueId = require('generate-unique-id');
const demoUserModel = require("../../models/DemouerModels/DemouserModel.js");

class demoUserController {

    static getDemoUser = async (req, res) => {
        let demoUser;
        try {
            // get all demo users
            let demoUsers = await demoUserModel.find();
            let previousDemoId = demoUsers.length;
            let newDemoId = previousDemoId + 1;
            // create Demouser Object
            let newDemoUser = new demoUserModel({
                Username: "Demouser" + newDemoId,
                DemoId: newDemoId,
                GameId: "Roulette@",
                Balance:"20000"
            });
            // save the new demo user in Demouser Model
            // demoUser =await newDemoUser.save();
            demoUser=await demoUserModel.findOne({Username:'Demouser1'});
            if (demoUser) {
                return res.json({result:true, demoUserCreated: true, user: demoUser, somethinwrong: false })
            } else {
                return res.json({result:true, demoUserCreated: false, user: null, somethinwrong: true })
            }
        }
        catch (error) {
            console.log(error);
            return res.json({result:true, demoUserCreated: false, user: null, somethinwrong: true })
        }
    }
}

module.exports = demoUserController;