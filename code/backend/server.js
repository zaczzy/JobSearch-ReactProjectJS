require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
//const mongoose = require("mongoose");
const passport = require("passport");
//const passportLocal = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const session = require("express-session");
const sgMail = require('@sendgrid/mail');
const generator = require('generate-password');

// const io = require('socket.io')(7000,
//   {cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     credentials: true
//   }
// });

// Import Models for Mongoose
const User = require('./models/user_model');
const Chat = require('./models/chat_model');


// Routers
const postRouter = require('./posts');
const commentRouter = require('./comments')
const userRouter = require('./user');
const chatRouter = require('./chat');
const s3Router = require('./s3');
const streamRouter = require('./stream');
// Setup express app
const app = express();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
/* const msg = {
  to: 'shadowbluex@gmail.com',
  from: 'danyul.lee@gmail.com',
  subject: 'Sending with Twilio SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};
sgMail.send(msg);
 */
//----------------------------------------- END OF IMPORTS---------------------------------------------------
/* mongoose.connect(
  "mongodb+srv://admin:mongoose@cluster0.yvohi.mongodb.net/agileman?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("Mongoose Is Connected");
  }
); */

var corsOptions = {
  origin: 'http://localhost:3000',
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// perform actions on the collection object
// put express setup stuff
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(cookieParser("secretcode"));
app.use(passport.initialize());
app.use(passport.session());
require("./passportConfig")(passport);


// Put Express Routes
app.get('/', function (req, res) {
  // res.send('Hello World');
  // for testing -- TODO REMOVE
  res.cookie('currId', '605e8617983b646829c04929').send('cookie set');
});

app.post("/login", (req, res, next) => {
  if (!req.body.email) {
    return res.status(422).json({
      errors: {
        email: "is required"
      }
    });
  }

  if (!req.body.password) {
    return res.status(422).json({
      errors: {
        password: "is required"
      }
    });
  }

  User.findOne({ email: req.body.email }).then(async (userObject) => {
    if (!userObject) {
      res.json({message: 'User Not Found'});
      return;
    }

    if (userObject.is_locked_out) {
      // in milliseconds
      //const legalLoginTime = new Date(oldDateObj.getTime() + diff*60000);
      const legalLoginTime = new Date()
      legalLoginTime.setTime(userObject.last_incorrect_login.getTime() + (10 * 60 * 1000));
      const dateNow = new Date(Date())
      //const testDate = new Date(userObject.last_incorrect_login)
      //console.log(Date() < legalLoginTime)
      //console.log(testDate)
      //console.log(legalLoginTime)
      //console.log(dateNow)
      //console.log(Date())
      if (dateNow < legalLoginTime) {
          res.send(`You are locked out of your account until ${legalLoginTime.toString()}`);
          return;
      }
      // can now log in again.
      userObject.is_locked_out = false;
      await userObject.save();
    }

    passport.authenticate("local", (err, user, info) => {
      if (err) throw err;
      if (!user) {
        // update incorrect login information, and lock out if necessary
        userObject.last_incorrect_login = Date.now();
        if (userObject.consecutive_incorrect_logins === undefined) {
            userObject.consecutive_incorrect_logins = 0;
        }
        userObject.is_locked_out = ++userObject.consecutive_incorrect_logins >= 3;
        userObject.save();

        if (userObject.is_locked_out) {
            res.send('You are now locked out of your account for 10 minutes.');
        } else {
            res.send('Wrong Password');
        }
      }

      else {
        req.login(user, (err) => {
          if (err) throw err;
          // reset incorrect login information
          userObject.consecutive_incorrect_logins = 0;
          userObject.save();
          res.cookie('currId', user._id.toString())
          res.send({message: "Successfully Authenticated", userObj: user})
          //console.log(req.user);

          //req.session.user = user;
          //req.session.save();
        });
      }
    })(req, res, next);
  });
});

app.post('/signup', function (req, res, next) {
  const { email, password, displayName, handle } = req.body;
  User.findOne({ "local.email": email }, (err, userMatch) => {
    if (userMatch) {
      return res.json({
        error: `Sorry, already a user with the email: ${email}`
      });
    }

    User.findOne({ "local.handle": handle }, (err, userMatch) => {
      if (userMatch) {
        return res.json({
          error: `Sorry, already a user with the handle: ${handle}`
        });
      }
      const newUser = new User({
        "local.handle": handle,
        "local.email": email,
        "local.displayName": displayName
      });

      newUser.setPassword(password);

      newUser.save((err, savedUser) => {
        if (err) return res.json(err);
        return res.json(savedUser);
      });
    });
  })
});

app.post("/register", (req, res) => {
  User.findOne({$or: [{ handle: req.body.handle}, { email: req.body.email }]}, async (err, doc) => {
    if (err) throw err;
    if (doc) res.send("User Already Exists");
    if (!doc) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const newUser = new User({
        handle: req.body.handle,
        displayName: req.body.displayName,
        email: req.body.email,
        password: hashedPassword,
        profilePic: "/stockImg.jpeg"
      });
      await newUser.save();
      res.send("User Created");
    }
  });
});

app.get('/logout', function(req, res){
  req.logout();
  res.clearCookie('currId');
  res.json({message: "Successfully logged out"});
});

app.post("/deactivate", (req, res, next) => {
  User.findOne({ email: req.body.email }, async (err, forgottenUser) => {
    if (err) throw err;
    if (forgottenUser) {
      passport.authenticate("local", (err, user, info) => {
        if (err) throw err;
        if (!user) {
          // update incorrect login information, and lock out if necessary
          res.send("Incorrect Credentials.");
        }
        else {
          req.login(user, (err) => {
            if (err) throw err;
            //res.json({message: 'Successfully Authenticated', userObj: user})
            console.log(req.user);
            const userID = forgottenUser._id;
            Chat.deleteMany({ users: userID })
              .then(() => {
                User.deleteOne({ email: req.body.email })
                .then(() => res.json({ message: `Deleted user ${req.body.email}` }))
                .catch((err) => res.send(`Could not delete user ${req.body.email}`));
              })
          });
        }
      })(req, res, next);
    }
    if (!forgottenUser) {
      res.send(`Cannot find user ${req.body.email}`)
    }
  });
});

app.post("/resetPassword", (req, res) => {
  const user = req.body.email;
  const newPassword = generator.generate({
      length: 10,
      numbers: true,
  });

  User.findOne({ email: user }, async (err, forgottenUser) => {
    if (err) throw err;
    if (forgottenUser) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const msg = {
        to: forgottenUser.email,
        from: 'danyul.lee@gmail.com',
        subject: 'Your password reset information',
        text: `Hi ${forgottenUser.email},\n \nYour new password is as follows:\n\n${newPassword}`,
      };

    sgMail.send(msg)
        .then((response) => {
          console.log(response[0].statusCode)
          console.log(response[0].headers)
          res.send(`Successfully sent email.`)
        })
        .catch((error) => {
          console.error(error)
          res.send(`Failed to send email.`)
        })

    forgottenUser.password = hashedPassword;
    forgottenUser.save()
        .then((usr) => res.send(`Successfully reset password for ${usr.email}.` ))
        .catch((err) => res.send(`Could not reset password for ${user}.`));
    }
    if (!forgottenUser) {
      res.send(`Cannot find user ${req.body.email}`)
    }
  });
});

app.post("/changePassword", (req, res, next) => {
  const user = req.body.email;
  const newPassword = req.body.newPassword

  User.findOne({ email: user }, async (err, forgottenUser) => {
    if (err) throw err;
    if (forgottenUser) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      passport.authenticate("local", (err, user, info) => {
        if (err) throw err;
        if (!user) {
          // update incorrect login information, and lock out if necessary
          res.send("Incorrect Credentials.");
        }
        else {
          req.login(user, (err) => {
            if (err) throw err;
            //res.json({message: 'Successfully Authenticated', userObj: user})
            console.log(req.user);
            forgottenUser.password = hashedPassword;
            forgottenUser.save()
              .then((usr) => res.send(`Successfully changed password for ${usr.email}.` ))
              .catch((err) => res.send(`Could not change password for ${user}.`));
          });
        }
      })(req, res, next);
    }
    if (!forgottenUser) {
      res.send(`Cannot find user ${req.body.email}`)
    }
  });
});

app.get("/user", (req, res) => {
  res.send(req.user); // The req.user stores the entire user that has been authenticated inside of it.
});


  //passport.authenticate('local'),
  //function(req, res) {
  // If this function gets called, authentication was successful.
  // `req.user` contains the authenticated user.
  //res.redirect('/users/' + req.user.username);
  // Add login logic here

// Here is how to set the cookie for future requests
// Make sure to replace 'placeholder' with the userId returned from the Database
//res.cookie('currId', 'placeholder').send('cookie set'); //Sets currId = placeholder

// Socket IO code here
// io.on('connection', (socket) => {
//   socket.send('Hello');
//
//   socket.on('sendMessage', (otherId) => {
//     console.log('Socket server send newMessage');
//     socket.send('Hello');
//     socket.emit('newMessage', otherId);
//   })
// });

app.use('/s3', s3Router);
app.use('/post', postRouter);
app.use('/comments', commentRouter);
app.use('/user', userRouter);
app.use('/chat', chatRouter);
app.use('/stream', streamRouter);

// catch 404
app.use((req, res, next) => {
  res.status(404).send('Unable to find the requested resource!');
});

// export for tests
module.exports = app;
