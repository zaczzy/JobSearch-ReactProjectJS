const sha256 = require('sha256');
const sgMail = require('@sendgrid/mail');
const generator = require('generate-password');
const User = require('../models/user_model.js');

// Routes

app.post("/register", (req, res) => {
  User.findOne( {$or: [{ handle: req.body.handle}, { email: req.body.email }]}, async (err, doc) => {
    if (err) throw err;
    if (doc) res.send("Handle or Email Already Exists");
    if (!doc) {
      
      const newUser = new User({
        email: req.body.email, 
        password: sha256(req.body.password),
        handle: req.body.handle, 
        displayName: req.body.displayName, 
        profilePic: "https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg"
      });

      await newUser.save();
      res.send("User Created");
    }
  });
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

  const email = req.body.email;
  const rawPassword = req.body.password;

  User.findOne({ email: email })
      .then(async (userObject) => {
          // first, check if locked out.
          if (userObject.is_locked_out) {
              // in milliseconds
              const legalLoginTime = userObject.last_incorrect_login.getTime() + 10 * 60 * 1000;
              if (Date.now() < legalLoginTime) {
                  res.send (`You are locked out of your account until ${legalLoginTime.toString()}`);
                  return;
              }
              // can now log in again.
              userObject.is_locked_out = false;
              await userObject.save();
          }
          if (userObject.password === sha256(rawPassword)) {
              // reset incorrect login information
              userObject.consecutive_incorrect_logins = 0;
              userObject.save();
              req.session.user = handle;
              req.session.save();
              //res.status(200).json({ user: ModelsToExternal.userOut(userObject) });
          } else {
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
                res.send('Incorrect Password.');
              }
          }
      })
      .catch((err) => ErrorHandler.clientError(res, err, 'handle could not be verified'));
});

//async function memberSince(req, res) {
//  if (ErrorHandler.checkInvalidInputs(res, [req.params.handle])) return;
//  User.findOne({ handle: req.params.handle })
//      .then((user) => res.json({ member_since: user.createdAt }))
//      .catch((err) => ErrorHandler.serverError(res, err, 'Something went wrong.'));
//}

app.post("/changePassword", (req, res) => {
  User.findOne({ handle: req.body.handle })
      .then((user) => {
          const correctPassword = sha256(req.body.old_password) === user.password;
          if (!correctPassword) {
              res.send('Incorrect current password.');
          } else {
              user.password = sha256(req.body.new_password);
              user.save()
                  .then((saved) => res.status(200).json({ message: 'Password updated.' }))
          }
      })
});

app.post("/register", (req, res) => {
  User.findOne( {$or: [{ handle: req.body.handle}, { email: req.body.email }]}, async (err, doc) => {
    if (err) throw err;
    if (doc) res.send("Handle or Email Already Exists");
    if (!doc) {
      
      const newUser = new User({
        email: req.body.email, 
        password: sha256(req.body.password),
        handle: req.body.handle, 
        displayName: req.body.displayName, 
        profilePic: "https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg"
      });

      await newUser.save();
      res.send("User Created");
    }
  });
});

app.delete("/deleteUser", (req, res) => {
  User.deleteOne({ handle: req.body.handle })
      .then(() => res.status(200).json({ message: `Deleted user ${req.body.handle}` }))
});

app.get("/user", (req, res) => {
  res.send(req.user); // The req.user stores the entire user that has been authenticated inside of it.
});

//----------------------------------------- END OF ROUTES---------------------------------------------------
//Start Server
app.listen(4000, () => {
  console.log("Server Has Started");
});
