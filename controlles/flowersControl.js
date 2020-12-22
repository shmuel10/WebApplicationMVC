const Flower = require('../models')("Flower");

const new_flower = async function (req, res, next) {
    console.log('newflower', req.body);
    try {
        let flower = Object.values(req.body);
        console.log("For simcha: ", flower);
        await Flower.CREATE(flower);
        console.log('User created:' + flower);
    } catch (err) { throw err; }
}

const flower_list = async function (req, res, next) {
    let flowersArr = await Flower.REQUEST();
    console.log(flowersArr);
    setTimeout(function () {
        res.render('partials/flowersTemp', { "flowersCatalog": flowersArr });
    }, 100)
}

const update_flower = async function (req, res, next) {
    console.log('req1 : ', req);
    try {
        let updatedFlower = req.body;
        await Flower.UPDATE(updatedFlower);
    } catch (err) { throw err; }
}

const delete_flower = async function (req, res, next) {
    await Flower.DELETE(req.body);
}

module.exports = {
    new_flower,
    flower_list,
    update_flower,
    delete_flower
}