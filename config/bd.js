require('dotenv').config();
const mongoose = require('mongoose');
const { connected } = require('process');

const createDB = ()=>{
    mongoose.connect(process.env.MONGOOSE_CONNECTION_URL)
    .then(()=>{console.log("DB conected")})
    .catch((e)=>{console.log(e)});

    // mongoose.connect(process.env.MONGOOSE_CONNECTION_URL, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false});
    // const connection = mongoose.connection;
    
    // connection.once('open', ()=>{
    //     console.log("DB connected");
    // })


}

module.exports = createDB;