const { json } = require('express');
var path = require('path');
const Flower = require('../models')("Flower");
var fs = require('fs');
const fetch = require('node-fetch');
const { url } = require('inspector');

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
    try {
        console.log("45", req.fields, '\n', "46", req.files);
        let updatedFlower = req.fields;
        var imageFile = req.files.myImage;
        console.log("files: ", imageFile.size);
        console.log("fields: ", updatedFlower);
        if (imageFile.size > 0) {
            var oldPath = imageFile.path;
            var newPath = './public/images/' + imageFile.name;
            var rawData = fs.readFileSync(oldPath);
            fs.writeFile(newPath, rawData, function (err) {
                if (err) console.log(err)
                else console.log("sucsseful");
            })
            updatedFlower.picture = newPath.replace('./public/', '');
            console.log("45", updatedFlower)
        }
        else if (updatedFlower.imageURL != '') {
            console.log('downloading!');
            const response = await fetch(updatedFlower.imageURL);
            const buffer = await response.buffer();
            var newPath = './public/images/img' + Math.floor(Math.random() * Math.floor(15000)) + '.jpg';
            fs.writeFile(newPath, buffer, () =>
                console.log('finished downloading!'));
            console.log("url:", updatedFlower.imageURL);
            updatedFlower.picture = updatedFlower.imageURL;
        }
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