const User = require('../models')("User");
const timeout = require('./timeout');
const prompt = require('./prompt');

(async () => {
  console.clear();
  await timeout(500);
  while (true) {
    let user = [];
    console.log();
    user[0] = await prompt("Please enter user mail: ");
    user[1] = await prompt('Please enter password: ');
    user[2] = await prompt('Please enter name: ');
    user[3] = await prompt('Please enter phone: ');
    user[4] = await prompt('Please enter type: ');
    user[5] = await prompt('Please enter city: ');
    user[6] = await prompt('Please enter flag: ');      
    console.log(user);
    try {
        await User.CREATE(user);
        console.log('User created:' + user);
    } catch(err) { throw err; }
  }
})();
