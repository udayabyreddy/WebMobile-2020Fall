const express = require("express");
var router = express.Router();
var ObjectId = require("mongoose").Types.ObjectId;
var { Books } = require("../models/books.model");
var { User } = require("../models/users.model");
var { Logs } = require("../models/logs.model");

// => localhost:3000/books/

// Used to get list of books
router.get("/", (req, res) => {
  Books.find((err, docs) => {
    if (!err) {
      res.send(docs);
    } else {
      console.log(
        "Error in Retriving Employees :" + JSON.stringify(err, undefined, 2)
      );
    }
  });
});

// Search books
router.get("/searchBy", (req, res) => {
  const searchValue = {
    title: "booktitle",
    author: "author",
    category: "category",
    isbn: "isbn",
  };
  Books.find(
    { [searchValue[req.query.category]]: {$regex: req.query.searchValue, $options: "i"} },
      // { [searchValue[req.query.category]]: req.query.searchValue },
    (err, docs) => {
      if (!err) {
        res.send(docs);
      } else {
        console.log(
          "Error in Retriving Books :" + JSON.stringify(err, undefined, 2)
        );
      }
    }
  );
});
// newUser.find({ name: { $regex: "s", $options: "i" } }

// Add new book
router.post("/addBook", (req, res) => {
  var book = new Books({
    booktitle: req.body.booktitle,
    author: req.body.author,
    category: req.body.category,
    desc: req.body.desc,
    stock: req.body.stock,
    ISBN: req.body.ISBN,
    issuedTo: req.body.issuedTo,
  });
  book.save((err, doc) => {
    if (!err) {
      res.send({
        isSuccess: true,
        errorMessage: null,
        docData: doc,
      });
    } else {
      console.log("Error in saving :" + JSON.stringify(err, undefined, 2));
      res.send({
        isSuccess: false,
        errorMessage: err,
        docData: null,
      });
    }
  });
});

// Issue book
router.post("/issueBook", (req, res) => {
  const today = new Date();
  const newdate = new Date();
  newdate.setDate(today.getDate() + 15);
  if (!ObjectId.isValid(req.body._id))
    return res.status(400).send(`No record with given id : ${req.body._id}`);

  Books.findByIdAndUpdate(
    req.body._id,
    {
      stock: req.body.stock - 1,
      issuedTo: req.query.id,
      issuedDate: today.toUTCString(),
      returnDate: newdate.toUTCString(),
    },
    (err, docs) => {
      if (err) {
        res.status(400).send(false);
        console.log(err);
      } else {
        updateBooksLog(
          req.query.id,
          "issue",
          req.body.booktitle,
          req.body.category
        );
        Books.find((err, docs) => {
          if (!err) {
            res.send(docs);
          } else {
            res.status(400).send(false);
            console.log(
              "Error in Retriving Books :" + JSON.stringify(err, undefined, 2)
            );
          }
        });
      }
    }
  );
});

// Return or renewables
router.get("/getReturns", (req, res) => {
  Books.find({ issuedTo: req.query.id }, (err, docs) => {
    if (!err) {
      res.send(docs);
    } else {
      console.log(
        "Error in Retriving Employees :" + JSON.stringify(err, undefined, 2)
      );
    }
  });
});

// Delete Book
router.delete("/:id", (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send(`No record with given id : ${req.params.id}`);

  Books.findByIdAndRemove(req.params.id, (err, doc) => {
    if (!err) {
      res.send(doc);
    } else {
      console.log(
        "Error in Login Delete :" + JSON.stringify(err, undefined, 2)
      );
    }
  });
});

// Update existing book
router.put("/:id", (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send(`No record with given id : ${req.params.id}`);

  const book = {
    booktitle: req.body.booktitle,
    author: req.body.author,
    category: req.body.category,
    desc: req.body.desc,
  };
  Books.findByIdAndUpdate(
    req.params.id,
    { $set: book },
    { new: true },
    (err, doc) => {
      if (!err) {
        res.send(doc);
      } else {
        console.log(
          "Error in Book Update :" + JSON.stringify(err, undefined, 2)
        );
      }
    }
  );
});

// Return books
router.put("/return/:id", (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send(`No record with given id : ${req.params.id}`);

  const book = {
    issuedTo: "",
    issuedDate: "",
    returnDate: "",
    stock: req.body.stock + 1,
  };
  updateBooksLog(
    req.body.issuedTo,
    "return",
    req.body.booktitle,
    req.body.category
  );
  Books.findByIdAndUpdate(
    req.params.id,
    { $set: book },
    { new: true },
    (err, doc) => {
      if (!err) {
        res.send(doc);
      } else {
        console.log(
          "Error in Book Update :" + JSON.stringify(err, undefined, 2)
        );
      }
    }
  );
});

// Return books
router.put("/renew/:id", (req, res) => {
  const today = new Date();
  const newdate = new Date();
  newdate.setDate(today.getDate() + 15);

  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send(`No record with given id : ${req.params.id}`);

  const book = {
    issuedDate: today.toUTCString(),
    returnDate: newdate.toUTCString(),
  };
  updateBooksLog(
    req.body.issuedTo,
    "renew",
    req.body.booktitle,
    req.body.category
  );
  Books.findByIdAndUpdate(
    req.params.id,
    { $set: book },
    { new: true },
    (err, doc) => {
      if (!err) {
        res.send(doc);
      } else {
        console.log(
          "Error in Book Update :" + JSON.stringify(err, undefined, 2)
        );
      }
    }
  );
});

// Activity Log
// Return or renewables
router.get("/getLogs", (req, res) => {
  Logs.find({ user: req.query.id }, (err, docs) => {
    if (!err) {
      res.send(docs);
    } else {
      console.log(
        "Error in Retriving Employees :" + JSON.stringify(err, undefined, 2)
      );
    }
  });
});

function updateBooksLog(userid, type, bookname, category) {
  let msg = "";
  if (type === "issue") {
    msg = `<div class="d-flex"><span><b>${bookname} </b></span>
    <span> was issued.</span></div>`;
  } else if (type === "renew") {
    msg = `<div class="d-flex"><span><b>${bookname} </b>
    </span><span> was renewed.</span></div>`;
  } else {
    msg = `<div class="d-flex"><span><b>${bookname} </b> </span>
    <span> was returned.</span></div>`;
  }
  var log = new Logs({
    user: userid,
    info: msg,
    category,
    date: new Date().toUTCString(),
  });
  log.save((err, doc) => {
    if (!err) {
      console.log(doc);
    } else {
      console.log("Error in saving :" + JSON.stringify(err, undefined, 2));
    }
  });
}

module.exports = router;
