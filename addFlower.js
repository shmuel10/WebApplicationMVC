const Flower = require('./models')("Flower");
const timeout = require("./timeout");
const prompt = require('./prompt');

(async () => {
  console.clear();
  await timeout(500);
  while (true) {
    let flower = [];
    console.log();
    flower[0] = await prompt("Please enter user id: ");
    flower[1] = await prompt('Please enter name: ');
    flower[2] = await prompt('Please enter price: ');
    flower[3] = await prompt('Please enter picture: ');     
    console.log(flower);
    try {
        await Flower.CREATE(flower);
        console.log('Flower created:' + flower);
    } catch(err) { throw err; }
  }
})();
