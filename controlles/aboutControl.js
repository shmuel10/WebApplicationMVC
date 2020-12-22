const about_us = function (req, res, next) {
    setTimeout(function () {
        res.render('partials/aboutUs');
    }, 100)
}

module.exports = {
    about_us
}