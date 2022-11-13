
checkLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
        next();
        return;
    }

    res.status(403).render('login', { message: "You are not loged in", color: "rgb(223, 77, 77)" });
    return;
}

module.exports = {
    checkLoggedIn
}