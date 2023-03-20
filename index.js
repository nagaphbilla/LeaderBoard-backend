require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require("cors");
const DomParser = require("dom-parser")

const fetch = (...args) =>
import('node-fetch').then(({default: fetch}) => fetch(...args));

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

// fetch("https://github.com/users/github/contributions?to=2023-12-31")
//         .then(data => data.text())
//         .then(res => {
//             var parser = new DomParser();
//             // console.log(res);
//             var dom = parser.parseFromString(res)
//             if(res == "Not Found") {
//                 console.log(res);
//             }
//             else {
//             var element = dom.getElementsByTagName('h2')[0].textContent
//             console.log(parseInt(element, 10))
//             }
//         })
   

const PORT = process.env.PORT || 5000;


app.listen(PORT,()=>{
    console.log(`Server started on  ${PORT}`)
})





