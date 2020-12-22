const User = require('../models')("User");

const users_list = async function (req, res, next) {
    let usersArr = await User.REQUEST();
    console.log("user arr", usersArr);
    usersArr = usersArr.filter(user => user['flag']);
    let params = new URLSearchParams(req.query);
    console.log("params user", params.get("user"));
    let user = usersArr.find(existUser => existUser.email === params.get("user"));
    console.log("u", user);
    let userType = user['type'];
    if (userType === "Officer") {
        usersArr = usersArr.filter(user => user["type"] === "Client");
    }
    console.log("user type: ", userType)
    setTimeout(function () {
        res.render('partials/usersTemp', { "users": usersArr, "userType": userType });
    }, 100)
}

const new_user = async function (req, res, next) {
    console.log('newuser', req.body);
    try {
        let user = Object.values(req.body);
        console.log("For simcha: ", user);
        await User.CREATE(user);
        console.log('User created:' + user);
    } catch (err) { throw err; }
}

const update_user = async function (req, res, next) {
    console.log('updateuser', req.body);
    try {
        let updatedUser = req.body;
        await User.UPDATE(updatedUser);
    } catch (err) { throw err; }
}

const delete_user = async function (req, res, next) {
    await User.DELETE(req.body);
}

module.exports = {
    users_list,
    new_user,
    update_user,
    delete_user
}