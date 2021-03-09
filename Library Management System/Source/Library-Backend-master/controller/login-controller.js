const express = require("express");
var router = express.Router();
var ObjectId = require("mongoose").Types.ObjectId;

var { User } = require("../models/users.model");

// Validate username and password
router.get("/checkLogin", (req, res) => {
  console.log(req.query);
  User.findOne(
    { username: req.query.username, password: req.query.password },
    (err, docs) => {
      console.log(err, docs);
      if (!err) {
        if (docs) {
          res.send(docs);
        } else {
          res.send(false);
        }
      } else {
        console.log(
          "Error in Retriving Employees :" + JSON.stringify(err, undefined, 2)
        );
      }
    }
  );
});

// => localhost:3000/user/
router.get("/", (req, res) => {
  User.find((err, docs) => {
    if (!err) {
      res.send(docs);
    } else {
      console.log(
        "Error in Retriving Employees :" + JSON.stringify(err, undefined, 2)
      );
    }
  });
});

router.post("/signUp", (req, res) => {
  var login = new User({
    username: req.body.username,
    password: req.body.password,
    active: true,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    joined: req.body.joined,
    gender: req.body.gender,
    address: req.body.address,
    booksissued: req.body.booksissued,
  });
  User.findOne({ username: req.body.username }, (err, docs) => {
    console.log(err, docs);
    if (!err) {
      if (docs) {
        res.send(false);
      } else {
        User.findOne({ email: req.body.email }, (err, docs) => {
          console.log(err, docs);
          if (!err) {
            if (docs) {
              res.send(false);
            } else {
              login.save((err, doc) => {
                if (!err) {
                  res.send(doc);
                } else {
                  console.log(
                    "Error in login Save :" + JSON.stringify(err, undefined, 2)
                  );
                  res.send(false);
                }
              });
            }
          } else {
            console.log(
              "Error in Retriving Employees :" +
                JSON.stringify(err, undefined, 2)
            );
          }
        });
      }
    } else {
      console.log(
        "Error in Retriving Employees :" + JSON.stringify(err, undefined, 2)
      );
    }
  });
});

router.put("/:id", (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send(`No record with given id : ${req.params.id}`);

  var login = {
    username: req.body.username,
    password: req.body.password,
    active: true,
  };
  console.log(login, req.body);
  User.findByIdAndUpdate(
    req.params.id,
    { $set: login },
    { new: true },
    (err, doc) => {
      if (!err) {
        res.send(doc);
      } else {
        console.log(
          "Error in User Update :" + JSON.stringify(err, undefined, 2)
        );
      }
    }
  );
});

router.delete("/:id", (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send(`No record with given id : ${req.params.id}`);

  User.findByIdAndRemove(req.params.id, (err, doc) => {
    if (!err) {
      res.send(doc);
    } else {
      console.log(
        "Error in Login Delete :" + JSON.stringify(err, undefined, 2)
      );
    }
  });
});

// Update user details
router.put("/updateDetails/:id", (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send(`No record with given id : ${req.params.id}`);

  var login = {
    password: req.body.password,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    gender: req.body.gender,
    address: req.body.address,
  };
  User.findByIdAndUpdate(
    req.params.id,
    { $set: login },
    { new: true },
    (err, doc) => {
      if (!err) {
        res.send(doc);
      } else {
        console.log(
          "Error in User Update :" + JSON.stringify(err, undefined, 2)
        );
      }
    }
  );
});

// Update user details
router.put("/updateBooksIssued/:id", (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send(`No record with given id : ${req.params.id}`);

  var login = {
    booksissued: req.body.booksissued + 1,
  };
  User.findByIdAndUpdate(
    req.params.id,
    { $set: login },
    { new: true },
    (err, doc) => {
      if (!err) {
        res.send(doc);
      } else {
        console.log(
          "Error in User Update :" + JSON.stringify(err, undefined, 2)
        );
      }
    }
  );
});

module.exports = router;
