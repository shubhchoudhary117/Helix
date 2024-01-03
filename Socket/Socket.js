const  server = require("../app.js")

const socketConnection = (req, res, next) => {
  try {

    const io = require("socket.io")(server, {
      maxHttpBufferSize: 1e8,
      cors: {
        origin: "http://localhost:3000",
        // credentials: true,
      },
    });



    io.on("connection", (socket) => {
      console.log("connected to the socket ");

      io.emit("welcome", "this is welcome message")

    })
    next();

  } catch (error) {
    console.log(error)
  }
}


module.exports=socketConnection;