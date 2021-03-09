const express = require("express");
var router = express.Router();
var ObjectId = require("mongoose").Types.ObjectId;

var { Admin } = require("../models/admin.model");

// Prepare default admin data
var defaultAdmin = new Admin({
  username: "libadmin",
  password: "password",
  active: true,
  firstname: "Admin",
  lastname: "",
  email: "libadmin@libadmin.com",
  joined: new Date().toLocaleString(),
  gender: "male",
  isDefault: true,
  address: "",
});

router.get("/", (req, res) => {
  Admin.find((err, docs) => {
    if (!err) {
      res.send(docs);
    } else {
      res.send(false);
      console.log(
        "Error in Retriving Admins :" + JSON.stringify(err, undefined, 2)
      );
    }
  });
});

router.get("/login", (req, res) => {
  Admin.find((err, docs) => {
    if (!err) {
      // If table is empty, then insert amdin
      if (
        docs === null ||
        docs === "" ||
        docs === undefined ||
        docs.length === 0
      ) {
        defaultAdmin.save((err, doc) => {
          if (!err) {
            console.log("Admin saved");
          } else {
            console.log(
              "Error in saving :" + JSON.stringify(err, undefined, 2)
            );
          }
        });
      }
    } else {
      console.log(
        "Error in Retriving Admins :" + JSON.stringify(err, undefined, 2)
      );
    }
  });
  Admin.findOne(
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
          "Error in Finding admin :" + JSON.stringify(err, undefined, 2)
        );
      }
    }
  );
});

router.post("/signUp", (req, res) => {
  var admin = new Admin({
    username: req.body.username,
    password: req.body.password,
    active: true,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    joined: req.body.joined,
    gender: req.body.gender,
    isDefault: false,
    address: req.body.address,
  });
  Admin.findOne({ username: req.body.username }, (err, docs) => {
    console.log(err, docs);
    if (!err) {
      if (docs) {
        res.send(false);
      } else {
        Admin.findOne({ email: req.body.email }, (err, docs) => {
          console.log(err, docs);
          if (!err) {
            if (docs) {
              res.send(false);
            } else {
              admin.save((err, doc) => {
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
              "Error in Retriving Admins :" + JSON.stringify(err, undefined, 2)
            );
          }
        });
      }
    } else {
      console.log(
        "Error in Retriving ADmins :" + JSON.stringify(err, undefined, 2)
      );
    }
  });
});

router.delete("/:id", (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send(`No record with given id : ${req.params.id}`);

  Admin.findByIdAndRemove(req.params.id, (err, doc) => {
    if (!err) {
      res.send(doc);
    } else {
      console.log(
        "Error in Login Delete :" + JSON.stringify(err, undefined, 2)
      );
    }
  });
});

router.put("/:id", (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send(`No record with given id : ${req.params.id}`);

  let admin = {
    username: req.body.username,
    password: req.body.password,
    active: true,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    joined: req.body.joined,
    gender: req.body.gender,
    isDefault: false,
    address: req.body.address,
  };
  Admin.findByIdAndUpdate(
    req.params.id,
    { $set: admin },
    { new: true },
    (err, doc) => {
      if (!err) {
        res.send(doc);
      } else {
        console.log(
          "Error in Admin Update :" + JSON.stringify(err, undefined, 2)
        );
      }
    }
  );
});

module.exports = router;
