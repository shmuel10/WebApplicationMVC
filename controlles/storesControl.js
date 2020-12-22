const Store = require('../models')("Store");

const next_store_ID = async function (req, res, next) {
    try{
        let nextID = await Store.GET_NEXT_ID();
        res.status(200).send({ "NextID" : nextID});
    }catch (err) { throw err; }
}

const new_store = async function (req, res, next) {
    try {
        let store = Object.values(req.body);
        console.log("store: ", store);
        await Store.CREATE(store);
        console.log('Store created:' + store);
    } catch (err) { throw err; }
}

const stores_list = async function (req, res, next) {
    let stores = await Store.REQUEST();
    stores = stores.filter(store => store['flag']);
    console.log(stores);
    setTimeout(function () {
        res.render('partials/storesTemp', { "stores": stores });
    }, 100)
}

const update_store = async function (req, res, next) {
    console.log('updatestore', req.body);
    try {
        let updatedStore = req.body;
        await Store.UPDATE(updatedStore);
    } catch (err) { throw err; }
}

const delete_store = async function (req, res, next) {
    await Store.DELETE(req.body);
}

module.exports = {
    next_store_ID,
    stores_list,
    new_store,
    update_store,
    delete_store
}