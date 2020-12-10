const debug = require("debug")("mongo:listusers");
const User = require('./models')("User");
const timeout = require("./timeout");

(async () => {
    // Inquire all the users at once and get it as an array
    try {
        users = await User.REQUEST();
        console.log(users);
    } catch (err) { debug(`Failed: ${err}`) }
    await timeout(1000);

    // Inquire the users one-by-one and provide a callback to process each one
    try {
        let index = 0;
        await User.REQUEST(async user => console.log(`Data ${++index}:\n${user}`));
        console.log('Finished');
        process.exit(0);
    } catch (err) { debug(`Failed: ${err}`) }
    process.exit(0);
})();
