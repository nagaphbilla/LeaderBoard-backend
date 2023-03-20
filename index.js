require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require("cors"); 



const mongoString = process.env.DATABASE_URL 
mongoose.connect(mongoString);
const userRoute= require('./routes/user');
const dataRoute= require('./routes/data');
const database = mongoose.connection
database.on('error',(error)=>{
    console.log(error);
})
database.once('connected',()=>{
    console.log('Database Connected');
})

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/users',userRoute);
app.use('/api/data',dataRoute);
   

const PORT = process.env.PORT || 5000;


app.listen(PORT,()=>{
    console.log(`Server started on  ${PORT}`)
})





