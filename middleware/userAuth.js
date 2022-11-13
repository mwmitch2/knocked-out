
checkLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
        next();
        return;
    }

    res.status(403).send({ message: "You are not logged in" })
}

module.exports = {
    checkLoggedIn
}