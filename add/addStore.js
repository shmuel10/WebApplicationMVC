const Store = require('../models')("Store");
const timeout = require('./timeout');
const prompt = require('./prompt');

(async () => {
  console.clear();
  await timeout(500);
  while (true) {
    let store = [];
    console.log();
    store[0] = await prompt("Please enter user address: ");
    store[1] = await prompt('Please enter manager: ');
    store[2] = await prompt('Please enter name: ');
    store[3] = await prompt('Please enter phone: ');     
    store[4] = await prompt('Please enter flag: ');     
    console.log(store);
    try {
        await Store.CREATE(store);
        console.log('Flower created:' + store);
    } catch(err) { throw err; }
  }
})();
