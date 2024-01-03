const express=require("express");
const DemouserController=require("../../Controllers/UserControllers/DemoUserController.js")
// create router
const router=express.Router();

router.get("/demouser",DemouserController.getDemoUser);


module.exports=router;