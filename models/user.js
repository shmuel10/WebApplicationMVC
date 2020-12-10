const debug = require("debug")("mongo:model-user");
const mongo = require("mongoose");

module.exports = db => {
    // create a schema
    let schema = new mongo.Schema({
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        name: { type: String, required: true },
        phone: { type: String, required: true },
        type: { type: String, required: true },
        city: { type: String, required: true },
        flag: { type: Boolean, required: true },
        created_at: Date,
        updated_at: Date
    }, { autoIndex: false });

    // custom method to add string to end of name
    // you can create more important methods like name validations or formatting
    // you can also do queries and find similar users
    schema.methods.dudify = function () {
        // add some stuff to the users name
        this.name = this.name + '-dude';
        return this.name;
    };

    schema.statics.CREATE = async function (user) {
        return this.create({
            email: user[0],
            password: user[1],
            name: user[2],
            phone: user[3],
            type: user[4],
            city: user[5],
            flag: user[6],
        });
    };

    schema.statics.UPDATE = async function (user) {
        console.log("user to update", user);
        if (user.hasOwnProperty("password")) {
            return this.updateOne({ "email": user.email, "flag": true }, {
                $set: {
                    "password": user.password, "name": user.name,
                    "phone": user.phone, "type": user.type, "city": user.city, updated_at: new Date()
                }, function() {
                    setTimeout(function () {
                        res.status(200).send();
                    }, 100)
                }
            });
        } else {
            return this.updateOne({ "email": user.email, "flag": true }, {
                $set: {
                    "name": user.name,
                    "phone": user.phone, "city": user.city, updated_at: new Date()
                }, function() {
                    setTimeout(function () {
                        res.status(200).send();
                    }, 100)
                }
            });
        }
    }

    schema.statics.DELETE = async function (user) {
        console.log("user to delete", user);
        return this.updateOne({ "email": user.email, "flag": true }, {
            $set: {
                "flag": false, updated_at: new Date()
            }, function() {
                setTimeout(function () {
                    res.status(200).send();
                }, 100)
            }
        });
    }

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

    schema.statics.REQUEST = async function () {
        // no arguments - bring all at once
        const args = Array.from(arguments); // [...arguments]
        if (args.length === 0) {
            debug("request: no arguments - bring all at once");
            return this.find({}).exec();
        }

        // perhaps last argument is a callback for every single document
        let callback = arguments[arguments.length - 1];
        if (callback instanceof Function) {
            let asynch = callback.constructor.name === 'AsyncFunction';
            debug(`request: with ${asynch ? 'async' : 'sync'} callback`);
            args.pop();
            let cursor, user;
            try {
                cursor = await this.find(...args).cursor();
            } catch (err) { throw err; }
            try {
                while (null !== (user = await cursor.next())) {
                    if (asynch) {
                        try {
                            await callback(user);
                        } catch (err) { throw err; }
                    }
                    else {
                        callback(user);
                    }
                }
            } catch (err) { throw err; }
            return;
        }

        // request by id as a hexadecimal string
        if (args.length === 1 && typeof args[0] === "string") {
            debug("request: by ID");
            return this.findById(args[0]).exec();
        }

        // There is no callback - bring requested at once
        debug(`request: without callback: ${JSON.stringify(args)}`);
        return this.find(...args).exec();
    };

    // the schema is useless so far
    // we need to create a model using it
    // db.model('User', schema, 'User'); // (model, schema, collection)
    db.model('User', schema); // if model name === collection name
    debug("User model created");
};
