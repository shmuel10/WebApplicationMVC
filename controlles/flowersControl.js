const { json } = require('express');
const multer = require('multer');
var path = require('path');
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

const storage = multer.diskStorage({
    destination: './public/',
    filename: function (req, file, cb) {
        console.log("439", file.originalname)
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Init Upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }
}).single('myImage');

const update_flower = async function (req, res, next) {
    try {
        let updatedFlower = req.body;
        upload(req, res, (err) => {
            // console.log(req.file.path);
            if (typeof (req.file) != "undefined") {
                let pict = JSON.stringify(req.file);
                let pictJson = JSON.parse(pict);
                updatedFlower.picture = pictJson.path;
                console.log("45", updatedFlower)
            }
        });
        //req.body.picture = req.file.path;
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