require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require("cors"); 



const mongoString = process.env.DATABASE_URL 
mongoose.connect(mongoString);
const routes= require('./routes/routes.js');
const database = mongoose.connection
database.on('error',(error)=>{
    console.log(error);
})
database.once('connected',()=>{
    console.log('Database Connected');
})

const app = express();
app.use(express.json());
app.use('/api',routes);
app.use(cors());
   

const PORT = process.env.PORT || 5000;


app.listen(PORT,()=>{
    console.log(`Server started on  ${PORT}`)
})





