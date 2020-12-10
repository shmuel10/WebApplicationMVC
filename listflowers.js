const debug = require("debug")("mongo:listflowers");
const Flower = require('./models')("Flower");
const timeout = require("./timeout");

(async () => {
    try {
        flowers = await Flower.REQUEST();
        console.log(flowers);
    } catch (err) { debug(`Failed: ${err}`) }
    await timeout(1000);

    try {
        let index = 0;
        await User.REQUEST(async flower => console.log(`Data ${++index}:\n${flower}`));
        console.log('Finished');
        process.exit(0);
    } catch (err) { debug(`Failed: ${err}`) }
    process.exit(0);
})();
