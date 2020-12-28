var express = require("express");
var router = express.Router();
var dbConn = require("../db/config");
var md5 = require("md5");

router.get("/:sortby?", function (req, res, next) {
  var sql = "SELECT Id,Name,Age,Email,isAuthorized,Manager FROM employees";
  if (req.params.sortby != undefined) {
    sql = sql + " ORDER BY " + req.params.sortby;
  }
  dbConn.query(sql, function (error, result) {
    res.json(result);
  });
});

router.get("/more/details/:sortby?", function (req, res, next) {
  var sql =
    "SELECT employees.id, employees.name, employees.age, employees.email, empdetails.designation, empdetails.hometown, empdetails.best FROM employees JOIN empdetails ON employees.id=empdetails.id ";
  if (req.params.sortby != undefined) {
    sql = sql + " ORDER BY " + req.params.sortby;
  }
  dbConn.query(sql, function (error, result) {
    res.json(result);
  });
});

router.post("/register", function (req, res, next) {
  dbConn.query(
    "INSERT INTO employees(name, age, email, password, authkey, isAuthorized, Manager) values ('" +
      req.body.name +
      "','" +
      req.body.age +
      "','" +
      req.body.email +
      "','" +
      md5(req.body.password) +
      "','" +
      md5(req.body.email + req.body.password) +
      "','" +
      req.body.isAuthorized +
      "','" +
      req.body.manager +
      "')",
    function (error, result) {
      res.send("User Created Successfully");
    }
  );
});

router.post("/login", function (req, res, next) {
  dbConn.query(
    "SELECT * FROM employees WHERE Email='" +
      req.body.email +
      "' AND Password='" +
      md5(req.body.password) +
      "'",
    function (error, result) {
      if (result.length > 0) {
        res.json(result[0]);
      } else {
        res.send("Can't login. Check email and password and try again.");
      }
    }
  );
});

router.post("/update/:field", function (req, res, next) {
  var sql =
    "UPDATE employees SET " +
    req.params.field +
    " = '" +
    req.body.update +
    "' WHERE Authkey= '" +
    req.body.AuthKey +
    "' ";
  dbConn.query(sql, function (error, result) {
    if (result.affectedRows > 0) {
      res.send("User successfully updated");
    } else {
      res.send("Updation failed. Check credentials and try again.");
    }
  });
});

router.post("/delete/:byValue", function (req, res, next) {
  dbConn.query(
    "SELECT * FROM employees WHERE Authkey= '" + req.body.authkey + "' ",
    function (error, result) {
      if (result.length == 0) {
        res.send("Operation failed. Check credentials and try again.");
      } else if (result[0].IsAuthorized == 1) {
        dbConn.query(
          "DELETE FROM employees WHERE " +
            req.params.byValue +
            " = '" +
            req.body.toBeDeleted +
            "' ",
          function (result, error) {
            console.log(result);
            res.send("User successfully deleted");
          }
        );
      } else {
        res.send("Deletion failed. You are not authorized to delete data.");
      }
    }
  );
});

module.exports = router;
