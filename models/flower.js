const debug = require("debug")("mongo:model-flower");
const multer = require('multer');
const mongo = require("mongoose");
const path = require("path");

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
            flag : flower[4]
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
    const storage = multer.diskStorage({
        destination: './public/images/',
        filename: function(req,file,cb){
            cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        }
    })

    const upload = multer ({
        storage : storage
    }).single('myImage')

    schema.statics.UPDATE = async function (req,res) {
        console.log("req", req);
        return this.updateOne({ "id": flower.id, "flag": true }, {
            $set: {
                "name": flower.name, "price": flower.price, "picture": flower.picture, updated_at: new Date()
            }, function() {
                setTimeout(function () {
                    res.status(200).send();
                }, 100)
            }
        });
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