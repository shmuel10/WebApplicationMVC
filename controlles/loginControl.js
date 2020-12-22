const User = require('../models')("User");

const login_control = async function (req, res, next) {
    let usersArr = await User.REQUEST();
    console.log("im arr: ", usersArr);
    usersArr = usersArr.filter(user => user['flag']);
    let existUser = usersArr.find(existUser => existUser.email === req.body.email);
    if (existUser) {
        if (existUser.password === req.body.password) {
            let userMail = existUser.email;
            console.log("userMail " + existUser);
            // connectedUsers.set(userMail, true);
            setTimeout(function () {
                res.status(200).send({ "Myuser": existUser });
            }, 100)
        } else {
            setTimeout(function () {
                res.status(401).send();
            }, 100)
        }
    } else {
        setTimeout(function () {
            res.status(401).send();
        }, 100)
    }
}

module.exports = {
    login_control
}