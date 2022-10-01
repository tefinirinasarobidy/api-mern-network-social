const express = require("express");
const  bodyParser = require('body-parser')
const  cookieParser = require('cookie-parser')
const userRoutes = require('./routes/user.routes')
const publicationRoutes = require('./routes/publication.routes')
require('dotenv').config({path: './config/.env'})
require('./config/db')
const { checkUser,requireAuth } = require('./middleware/auth.middleware')
const cors = require("cors");
const app = express();

// body parser 
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())


// jwt
app.get('*',checkUser)
app.get('/jwtid',requireAuth, (req, res) => {
  res.status(200).send(res.locals.user._id)
})

// route 
app.use('/api/user',userRoutes)
app.use('/api/publication',publicationRoutes)


// set port, listen for requests
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}.`);
});