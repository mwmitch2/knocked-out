const roles = require("../roles")

isTeam = (req, res, next) => {
    if(req.user.role === roles.TEAM) {
        next();
        return;
    }
    res.status(403).render('login', { message: "Access Denied", color: "rgb(223, 77, 77)" });
    return;
}

isOrganizer = (req, res, next) => {
    if(req.user.role === roles.ORGANIZER) {
        next();
        return;
    }
    res.status(403).render('login', { message: "Access Denied", color: "rgb(223, 77, 77)" });
    return;
}

isAdmin = (req, res, next) => {
    if(req.user.role === roles.ADMIN) {
        next();
        return;
    }
    res.status(403).render('login', { message: "Access Denied", color: "rgb(223, 77, 77)" });
    return;
}

isTeamOrOrganizer = (req, res, next) => {
    if(req.user.role === roles.TEAM || req.user.role === roles.ORGANIZER) {
        next();
        return;
    }
    res.status(403).render('login', { message: "Access Denied", color: "rgb(223, 77, 77)" });
    return;
}

module.exports = {
    isTeam,
    isOrganizer,
    isAdmin,
    isTeamOrOrganizer
}