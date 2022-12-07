const express = require('express')
const app = express()
const web = require('./routes/web')
// const port=process.env.PORT || 3600
const session = require('express-session')
const cookieParser = require('cookie-parser')
app.use(cookieParser())
const flash = require('connect-flash')
const passport = require('passport')
const googleStrategy = require('passport-google-oauth20')
passport.serializeUser(function(user,done){
  done(null, user)
})
passport.deserializeUser(function(user,done){
  done(null, user)
})
passport.use(new googleStrategy({
  clientID:"500925359457-50h42n4b9267ia87e4bn39mh1nl4df28.apps.googleusercontent.com",
  clientSecret:"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",
  callbackURL:"/auth/google/callback",
  passReqToCallback:true
},(request,accessToken,refreshToken,profile,done)=>{
  // console.log(profile)
  return done(null,profile)
 

}) )
//message showing 
app.use(session({
  secret:'secret',
  cookie: {maxAge:60000},
  resave: false,
  saveUninitialized:false,

}));
app.use(passport.initialize())
app.use(passport.session())




const dotenv = require('dotenv')
dotenv.config({path:'.env'})

//for submitting the form
const bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())   


app.use(flash());
//routing page called
app.use('/',web)

 



//db connection
const connectDB=require('./db/connectdb')
connectDB()





//for image use
app.use(express.static('public'))










app.set('view engine','ejs')

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`)
})