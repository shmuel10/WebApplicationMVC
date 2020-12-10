const debug = require("debug")("lab8:todo");
const mongo = require("mongoose");
const Schema = mongo.Schema;

module.exports = db => {
    let schema = new Schema({text : String});

    // CRUD without the U
    schema.statics.CREATE = async function (str) {return this.create({text: str}); };
        //return this.find({text: str}).exec(); };

    schema.statics.REQUEST = async function(cb) {
        let cursor;
        let asynch = cb.constructor.name === 'AsyncFunction';
        try {
            cursor = await this.find().cursor();
        } catch (err) { debug(err); throw err; }
        try {
            while (todo = await cursor.next())
                if (asynch)
                    try { await cb(todo); } catch (err) { debug(err); throw err; }
                else
                    cb(todo);
        } catch (err) { debug(err); throw err; }
    };

    schema.statics.DELETE = async function(id) { return this.findByIdAndRemove(id).exec(); };

    db.model('ToDo', schema , 'todos');
};
