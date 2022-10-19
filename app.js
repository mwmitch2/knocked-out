var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    cookieParser = require("cookie-parser"),
    LocalStrategy = require("passport-local"),
    flash        = require("connect-flash"),
    User        = require("./models/user"),
    session = require("express-session"),
    methodOverride = require("method-override");
// configure dotenv
require('dotenv').config();

//requiring routes
let indexRoutes = require("./routes/index")
let tournamentRoutes = require('./routes/tournaments')    

// assign mongoose promise library and connect to database
mongoose.Promise = global.Promise;

const databaseUri = process.env.MONGODB_URI;

mongoose.connect(databaseUri)
      .then(() => console.log(`Database connected`))
      .catch(err => console.log(`Database connection error: ${err.message}`));

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.use(cookieParser('secret'));
//require moment
app.locals.moment = require('moment');

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Very secret message",
    resave: false,
    saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(function(user, done) {
    done(null, user.id)
})
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user)
    })
})

app.use(function(req, res, next){
   res.locals.currentUser = req.user
   res.locals.success = req.flash('success')
   res.locals.error = req.flash('error')
   next();
});


app.use("/", indexRoutes);
app.use('/tournaments', tournamentRoutes)

app.listen(process.env.PORT, function(){
   console.log("Knocked Out App is Running!");
});