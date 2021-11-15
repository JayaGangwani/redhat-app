const express = require('express') // Include ExpressJS
const app = express() // Create an ExpressJS app
const bodyParser = require('body-parser'); // Middleware
var jwt = require('jsonwebtoken');
const cors = require("cors");
const { PORT, userName, password } = require("./config");
const User = require("./models/User");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

app.use(cors());


var mongoose = require('mongoose')
mongoose.connect('mongodb+srv://jaya:jaya@cluster0.8p7tj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', { useMongoClient: true })
  .then(() => { console.log(`Succesfully Connected to the Mongodb Database `) })
  .catch(() => { console.log(`Error Connecting to the Mongodb Database`) })

app.post('/signup', (req, res) => {
  console.log(req.body);
  let user = req.body.userName;
  let pass = req.body.password;
  const newUser = new User({ _id: new mongoose.Types.ObjectId(), userName: user, password: pass, starredRepos: [] });
  newUser.save().then(result => {
    res.status(201).json({
      message: "Data inserted successfully",
    });
  }).catch(err => {
    res.status(500).json({
      message: "Something went wrong",
      error: err
    });
  });
});

app.post('/login', (req, res) => {
  console.log(req.body);
  let user = req.body.userName;
  let pass = req.body.password;
  User.find({ userName: user, password: pass }).exec().then(response => {
    const token = jwt.sign({
      exp: Math.floor(Date.now() / 1000) + (60 * 60),
      data: response[0]
    }, 'secret');
    if (!response.length) res.status(404).json({ message: "No entries found" });
    else
      res.status(200).json({ user: response[0], token });//user will contain our user

  }).catch(err => {
    res.status(500).json({
      message: "Failed to fetch data",
      error: err
    });
  });
});
//api call toh kiya nhi
//krenge
//yoo
//:) :*)
app.get('/starredRepos/:userName', (req, res) => {
  let user = req.params.userName;
  User.find({ userName: user }).exec().then(response => {

    if (!response.length) res.status(404).json({ message: "No entries found" });
    else
      res.status(200).json({ user: response[0] });//user will contain our user

  }).catch(err => {
    res.status(500).json({
      message: "Failed to fetch data",
      error: err
    });
  });
});

app.get('/starRepo/:userName/:repoName/:operation', (req, res) => {
  let user = req.params.userName;
  let repoName = req.params.repoName;
  let op = req.params.operation;//add or remove
  if (op === "add") {
    User.update({ userName: user }, {
      $push: {
        starredRepos: repoName
      }
    })
      .exec()
      .then(result => {
        res.status(200).json({
          message: "Data updated successfully",
          result: result
        });
      })
      .catch(err => {
        res.status(500).json({
          message: "something went wrong",
          error: err
        });
      });
  } else if (op === "remove") {
    User.update({ userName: user }, {
        $pull: {
          starredRepos: { $in: [repoName] }
        }})
      .exec()
      .then(result => {
        res.status(200).json({
          message: "Data updated successfully",
          result: result
        });
      })
      .catch(err => {
        res.status(500).json({
          message: "something went wrong",
          error: err
        });
      });
  }
});

authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "search");
    req.userData = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      err: error
    });
    return res;
  }
};

const port = PORT // Port we will listen on

// Function to listen on the port
app.listen(port, () => console.log(`This app is listening on port ${port}`));

