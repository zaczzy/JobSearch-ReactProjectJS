const app = require('./server');
const mongoose = require('mongoose');
const appPort = 5000;
//const passport = require("passport");
//const bcrypt = require("bcryptjs");
// const socketPort = 7000;
//
// // io.listen(socketPort);
// console.log('scoket listening on port ', socketPort);
// Connect to the db
const uri = "mongodb+srv://admin:mongoose@cluster0.yvohi.mongodb.net/agileman?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
try {
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
      .then((result) => app.listen(appPort))
      .catch((err) => console.log(`Server already up on port ${appPort}`));
} catch (err) {
    console.log(`Server already up on port ${appPort}`);
}
