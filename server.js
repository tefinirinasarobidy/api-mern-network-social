const express = require("express");
const  bodyParser = require('body-parser')
const userRoutes = require('./routes/user.routes')
require('dotenv').config({path: './config/.env'})
require('./config/db')
const cors = require("cors");
const app = express();

// body parser 
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// route 
app.use('/api/user',userRoutes)



// set port, listen for requests
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}.`);
});