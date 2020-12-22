const debug = require("debug")("mongo:liststores");
const Store = require('../models')("Store");
const timeout = require("./timeout");

(async () => {
    try {
        stores = await Store.REQUEST();
        console.log(stores);
    } catch (err) { debug(`Failed: ${err}`) }
    await timeout(1000);

    try {
        let index = 0;
        await Store.REQUEST(async Store => console.log(`Data ${++index}:\n${Store}`));
        console.log('Finished');
        process.exit(0);
    } catch (err) { debug(`Failed: ${err}`) }
    process.exit(0);
})();
