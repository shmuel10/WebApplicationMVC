const debug = require("debug")("mongo:model-flower");
const mongo = require("mongoose");

module.exports = db => {
    // create a schema
    let schema = new mongo.Schema({
        id: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        price: { type: String, required: true },
        picture: { type: String, required: true },
        flag: { type: Boolean, required: true },
        created_at: Date,
        updated_at: Date
    }, { autoIndex: false });

    // on every save, add the date
    schema.pre('save', function (next) {
        // get the current date
        let currentDate = new Date();
        // change the updated_at field to current date
        this.updated_at = currentDate;
        // if created_at doesn't exist, add to that field
        if (!this.created_at)
            this.created_at = currentDate;
        next();
    });

    schema.statics.CREATE = async function (flower) {
        return this.create({
            id: flower[0],
            name: flower[1],
            price: flower[2],
            picture: flower[3],
            flag: flower[4]
        });
    };

    schema.statics.REQUEST = async function () {
        const args = Array.from(arguments);
        if (args.length === 0) {
            debug("request: no arguments - bring all at once");
            return this.find({}).exec();
        }

        let callback = arguments[arguments.length - 1];
        if (callback instanceof Function) {
            let asynch = callback.constructor.name === 'AsyncFunction';
            debug(`request: with ${asynch ? 'async' : 'sync'} callback`);
            args.pop();
            let cursor, Flower;
            try {
                cursor = await this.find(...args).cursor();
            } catch (err) { throw err; }
            try {
                while (null !== (Flower = await cursor.next())) {
                    if (asynch) {
                        try {
                            await callback(Flower);
                        } catch (err) { throw err; }
                    }
                    else {
                        callback(Flower);
                    }
                }
            } catch (err) { throw err; }
            return;
        }

        if (args.length === 1 && typeof args[0] === "string") {
            debug("request: by ID");
            return this.findById(args[0]).exec();
        }

        debug(`request: without callback: ${JSON.stringify(args)}`);
        return this.find(...args).exec();
    };

    schema.statics.UPDATE = async function (flower) {
        console.log("flower to update: ", flower);
        if (flower.hasOwnProperty("picture")) {
            return this.updateOne({ "id": flower.editFlowerID, "flag": true }, {
                $set: {
                    "name": flower.editFlowerName, "price": flower.editFlowerPrice, "picture": flower.picture, updated_at: new Date()
                }, function() {
                    setTimeout(function () {
                        res.status(200).send();
                    }, 100)
                }
            });
        } else {
            return this.updateOne({ "id": flower.editFlowerID, "flag": true }, {
                $set: {
                    "name": flower.editFlowerName, "price": flower.editFlowerPrice, updated_at: new Date()
                }, function() {
                    setTimeout(function () {
                        res.status(200).send();
                    }, 100)
                }
            });
        }
    }

    schema.statics.DELETE = async function (flower) {
        return this.updateOne({ "id": flower.id },
            {
                $set: {
                    updated_at: new Date(), flag: false
                },
                function() {
                    setTimeout(function () {
                        res.status(200).send();
                    }, 100)
                }
            });
    }

    db.model('Flower', schema);
    debug("Flower model created");
};