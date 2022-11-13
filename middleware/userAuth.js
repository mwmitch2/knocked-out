
checkLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
        next();
        return;
    }

    res.status(403).render('login');
    return;
}

module.exports = {
    checkLoggedIn
}