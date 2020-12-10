const debug = require("debug")("mongo:model");
const mongo = require("mongoose");

let db = mongo.createConnection();
(async () => {
    try {
        await db.openUri('mongodb://localhost/WebAppMVCDB',{ useNewUrlParser: true , useUnifiedTopology: true });
    } catch (err) {
        debug("Error connecting to DB: " + err);
    }
})();
debug('Pending DB connection');

require("./user")(db);
require("./flower")(db);
require("./store")(db);
require("./todo")(db);

module.exports = model => db.model(model);
