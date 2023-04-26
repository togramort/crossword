const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const schema = mongoose.Schema;

const userSchema  = new schema({
    login: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
});

const User = mongoose.model('User', userSchema, 'login');

const user = new User({
    login: "not admin",
    password: "coolcool"
});

User.findOne({})
  .then((result) => {
    if (result) {
      console.log("at least one object in login");
    } else {
      return user.save();
    }
  })
  .catch((err) => {
    console.error(err);
});

async function handleLogin(req, res) {
  const username = req.body.username;
  const password = req.body.password;
  try {
    const user = await User.findOne({ login: username });
    if (!user) {
      console.log("in not user")
      return res.status(400).send('wrong login');
    } else if (password !== user.password) {
      console.log("in not res")
      return res.status(400).send('wrong password');
    } else {
      console.log("in e;se")
      res.redirect('/generator');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('server error');
  }
};

module.exports = {handleLogin};