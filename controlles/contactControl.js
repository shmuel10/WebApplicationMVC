const contact_us = function (req, res, next) {
    setTimeout(function () {
        res.render('partials/ContactUs');
    }, 100)
}

module.exports = {
    contact_us
}