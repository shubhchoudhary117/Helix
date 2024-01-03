const mongoose = require("mongoose");
const connect = async () => {

    try{
        mongoose.connect(process.env.MONGO_URI, { dbName: process.env.DB_NAME}).then(() => {
            console.log('mongodb Connected')
        }).catch((err) => console.log(err.message));
        mongoose.connection.on('connected', () => {
            console.log("Mongoose Connected to db")
        })
        mongoose.connection.on('error', (err) => {
            console.log(err.message)
        })
    
        mongoose.connection.on('disconnected', () => {
            console.log('mongoose Connection is disconnected')
        })
        process.on('SIGINT', async () => {
            await mongoose.connection.close()
            process.exit(0)
        })
    
    }
    catch(error){
        throw error
    }

   
}

module.exports = connect;