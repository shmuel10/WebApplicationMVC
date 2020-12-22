const debug = require("debug")("mongo:model-store");
const mongo = require("mongoose");

module.exports = db => {
    // create a schema
    let schema = new mongo.Schema({
        id: { type: String },
        address: { type: String, required: true },
        manager: { type: String, required: true },
        name: { type: String, required: true },
        phone: { type: String, required: true },
        flag: { type: Boolean, required: true },
        created_at: Date,
        updated_at: Date
    }, { autoIndex: false });

    let nextId;
    schema.statics.GET_NEXT_ID = async function () {
        let tmp = await this.find()//.sort({id:-1}).limit(1);
        console.log("tmp length ", tmp.length);
        if (tmp.length === 0) {
            nextId = Math.floor(Math.random() * 10000000);
        } else {
            let tmp = await this.find().sort({ id: -1 }).limit(1);
            let prevID = tmp[0].id;
            console.log("tmp prev ", prevID);
            nextId = +prevID + 1;
        }
        console.log("tmp+1 ", nextId);
        return nextId;
    }

    // on every save, add the date
    schema.pre('save', function (next) {
        this.id = nextId;
        //let lastStoreID = this.stores.find().sort({"id":-1}).limit(1);
        console.log("salim", db);
        // get the current date
        let currentDate = new Date();
        // change the updated_at field to current date
        this.updated_at = currentDate;
        // if created_at doesn't exist, add to that field
        if (!this.created_at)
            this.created_at = currentDate;
        next();
    });

    schema.statics.CREATE = async function (store) {
        return this.create({
            address: store[0],
            manager: store[1],
            name: store[2],
            phone: store[3],
            flag: store[4],
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
            let cursor, Store;
            try {
                cursor = await this.find(...args).cursor();
            } catch (err) { throw err; }
            try {
                while (null !== (Store = await cursor.next())) {
                    if (asynch) {
                        try {
                            await callback(Store);
                        } catch (err) { throw err; }
                    }
                    else {
                        callback(Store);
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

    schema.statics.UPDATE = async function (store) {
        console.log("update" ,store)
        return this.updateOne({ "id": store.id, "flag": true }, {
            $set: {
                "address": store.address,
                "manager": store.manager,
                "name": store.name,
                "phone": store.phone,
                updated_at: new Date(),
            }, function() {
                setTimeout(function () {
                    res.status(200).send();
                }, 100)
            }
        });
    }

    schema.statics.DELETE = async function (flower) {
        return this.updateOne({ "id": flower.id, "flag": true },
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

    db.model('Store', schema);
    debug("Store model created");
};