const express = require("express");
const BetRoutes = require("./routes/BetRoutes/BetRoutes.js");
const DemouserRoutes = require("./routes/DemoUserRoutes/DemoUserRoute.js")
const cors = require("cors");
const DBConnection = require("./db/connection.js")
const https = require("https")
const fs = require("fs");
const GameRoutes=require("./routes/GameRoutes/GameRoutes.js")
const path = require("path")
var dotenv = require("dotenv");

dotenv.config();
// connect to database
DBConnection();
// create express app
const app = express();

// set middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors())

// set the routes prefix
app.use("/helix/bet", BetRoutes);
app.use("/helix/bet", DemouserRoutes);
app.use("/helix/game",GameRoutes)
// define port
const PORT = process.env.PORT || 9000;

const server = app.listen(PORT, () => {
  console.log(`app is runnig on port ${PORT}`)
})


// // socket connections
// const io = require("socket.io")(server, {
//   maxHttpBufferSize: 1e8,
//   cors: {
//     origin: "http://localhost:3000",
//     credentials: true,
//   },
// });

// // generate the random number
// function getRandomFloat(min, max) {
//   return Math.random() * (max - min) + min;
// }

// var betNumber=0;
// // // make socket connections 
// io.on("connection", (socket) => {
//   console.log("connected to the socket ");
//   // generate the number
//   // let betNumber=getRandomFloat(1,25).toFixed(2);
//   betNumber+=0.1;
//   // send the bet number to client
//   io.emit("current-bet-number",betNumber.toFixed(2))
//   // on send bet number
//   // socket.on("on-send-current-bet", (betNumber) => {
//   //   // debuging
//   //   console.warn(betNumber)
//   //   // on request to get current bet number then i  send current bet number
//   //   io.emit("on-get-current-bet", betNumber);
//   // })

// })


module.exports = server

// const sslServer=https.createServer({
//   key:fs.readFileSync(path.join(__dirname,'./cert/key.pem')),
//   cert:fs.readFileSync(path.join(__dirname,'./cert/cert.pem'))
// },app)

// sslServer.listen(PORT,()=>console.log(`server is running on port ${PORT}`))

