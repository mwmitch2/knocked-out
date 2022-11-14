
checkLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
        next();
        return;
    }

    res.status(403).render('login', { message: "You are not logged in", color: "rgb(223, 77, 77)" });
    return;
}

logout = (req, res, next) => {
    req.logout((err) => {
        if(err) {
            res.status(403).send({ message: "error logging out" });
            return;
        }
        next();
    })
}

module.exports = {
    checkLoggedIn,
    logout
}