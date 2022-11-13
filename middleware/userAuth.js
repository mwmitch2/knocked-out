
checkLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
        next();
        return;
    }

    res.status(403).render('login', { "err-message": "You are not loged in" });
    return;
}

module.exports = {
    checkLoggedIn
}