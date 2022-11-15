var express     = require("express"),
    app         = express(),
    http        = require('http'),
    server      = http.createServer(app),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    cookieParser = require("cookie-parser"),
    LocalStrategy = require("passport-local"),
    flash        = require("connect-flash"),
    User        = require("./models/user"),
    session = require("express-session"),
    methodOverride = require("method-override");
const io = require('socket.io')(server)
const Tournament = require("./models/tournament");
const Team = require("./models/user");

io.sockets.on('connection', (socket => {
    socket.on('join', (room) => {
        socket.join(room);
    })
}))

io.sockets.on('disconnect', (socket) => {
    socket.off('join')
})

changeStreamTournament = Tournament.watch();
changeStreamTournament.on('change', (changeEvent) => {
    if(changeEvent.operationType == 'update') {
        Tournament.findOne({ _id: changeEvent.documentKey }).populate('teams').exec((err, tournament) => {
            if(err) throw err
            io.to(`${tournament.name}`).emit('databaseUpdate', tournament)

            tournament.full = tournament.teams.length >= tournament.size;
            tournament.save();
        })
    } else if(changeEvent.operationType == 'insert' || changeEvent.operationType == 'delete') {
        Tournament.find({}).exec((err, tournaments) => {
            if(err) throw err
            io.to("adminTournaments").emit('tournamentsUpdate', tournaments);
        })
    }
})

changeStreamTeam = Team.watch();
changeStreamTeam.on('change', (changeEvent) => {
    if(changeEvent.operationType == 'insert' || changeEvent.operationType == 'delete') {
        Team.find({ role: "team" }).exec((err, teams) => {
            if(err) throw err
            io.to("adminTeams").emit('teamsUpdate', teams);
        })
    }
})
    
// configure dotenv
require('dotenv').config();

const {errorHandler} = require('./middleware/errorMiddleware')

//requiring routes
let indexRoutes = require("./routes/index");
let tournamentRoutes = require('./routes/tournaments')
let organizerRoutes = require('./routes/organizer');    
const { $where } = require("./models/user");

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

app.use(express.json())
app.use(express.urlencoded( {extended: false} ))

app.use("/", indexRoutes);
app.use('/tournaments', tournamentRoutes)
app.use('/api/tourneys', organizerRoutes)

app.use(errorHandler)

server.listen(process.env.PORT, function(){
   console.log("Knocked Out App is Running!");
});

changeStreamTournament.close();
changeStreamTeam.close()