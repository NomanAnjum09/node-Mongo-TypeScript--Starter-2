import cookieParser from 'cookie-parser';
import mongoose from "mongoose"
import UserRouter from "./Routes/UserRoutes"

const express = require('express')
const app = express()
//Import the main Passport and Express-Session library
const passport = require('passport')
const session = require('express-session')
var bodyParser = require('body-parser')

//Import the secondary "Strategy" library
const LocalStrategy = require('passport-local').Strategy

app.use(session({
    secret: "secret",
    resave: false ,
    saveUninitialized: true ,
  }))
app.use(cookieParser());
app.use(express.json())
  // This is the basic express session({..}) initialization.
  app.use(passport.initialize()) 
  // init passport on every route call.
  app.use(passport.session())    
  app.use(UserRouter);
  app.use(express.urlencoded({extended:false}))
  app.use(bodyParser.json());

const PORT: string | number = process.env.PORT || 4000
const uri: string = process.env.ConnectionString || ""


mongoose
  .connect(uri)
  .then(() =>
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    )
  )
  .catch(error => {
    throw error
  })