const roles = require("../roles")

isTeam = (req, res, next) => {
    if(req.user.role === roles.TEAM) {
        console.log('team authorized')
        next();
        return;
    }
    res.status(403).render('login', { errMessage: "Access Denied" });
    return;
}

isOrganizer = (req, res, next) => {
    if(req.user.role === roles.ORGANIZER) {
        next();
        return;
    }
    res.status(403).render('login', { errMessage: "Access Denied" });
    return;
}

isAdmin = (req, res, next) => {
    if(req.user.role === roles.ADMIN) {
        next();
        return;
    }
    res.status(403).render('login', { errMessage: "Access Denied" });
    return;
}

isTeamOrOrganizer = (req, res, next) => {
    if(req.user.role === roles.TEAM || req.user.role === roles.ORGANIZER) {
        next();
        return;
    }
    res.status(403).render('login', { errMessage: "Access Denied" });
    return;
}

module.exports = {
    isTeam,
    isOrganizer,
    isAdmin,
    isTeamOrOrganizer
}