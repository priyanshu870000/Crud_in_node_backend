const express = require("express");
const app = express();
const mysql = require("mysql");
const db = require("./db");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWTverify = require('./middleware/JWTverify')
const PORT = 3001;
const corsOptions = {
  origin: "https://black-fireman-hcsys.pwskills.app:5173",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// signup
app.post("/Signup", (req, res) => {
  db.query(
    "SELECT email FROM users WHERE email=?",
    [req.query.email],
    (err, data) => {
      if (err) {
        console.log("error", err);
      } else {
        if (data[0]) {
          res.json({
            message: "user already exists",
          });
        } else {
          bcrypt.hash(req.query.password, 10, (err, hash) => {
            console.log(hash);
            db.query(
              "INSERT INTO users SET ?",
              {
                username: req.query.username,
                email: req.query.email,
                password: hash,
              },
              async (err, response) => {
                if (err) {
                  console.log("error", err);
                } else {
                  const token = await jwt.sign(
                    { email: req.query.email, usernmae: req.query.username },
                    "priyanshu",
                    { expiresIn: "1h" }
                  );
                  res.json({
                    message: "Signup successfully",
                    token: token,
                  });
                }
              }
            );
          });
        }
      }
    }
  );
});

// login
app.post("/login", (req, res) => {
  db.query(
    "SELECT email,password FROM users WHERE email=?",
    [req.query.email],
    async (err, data) => {
      const result = await bcrypt.compare(req.query.password, data[0].password);
      if (result === true) {
        const token = await jwt.sign(
          { email: req.query.email, usernmae: req.query.username },
          "priyanshu",
          { expiresIn: "1h" }
        );
        res.json({
          message: "Signup successfully",
          token: token,
        });
      } else {
        res.json({
          message: "Please fill correct details",
        });
      }
    }
  );
});

//CRUD

//add

app.post("/add/:token",JWTverify, (req, res) => {
  db.query(
    "INSERT INTO project SET ?",
    {
      project_name: req.query.Name,
      project_desc: req.query.Desc,
      project_status: req.query.status,
      project_email: req.query.email,
    },
    (err, data) => {
      if (err) {
        console.log("error", err);
        res.json({
          message: "something went wrong",
        });
      }

      res.json({
        message: "added successfully",
      });
    }
  );
});

// show data
app.get("/showdata/:token",JWTverify, (req, res) => {
  db.query(
    "SELECT * from project WHERE project_email=?",
    [req.query.email],
    (err, data) => {
      if (err) {
        console.log("error", err);
        res.json({
          message: "something went wrong",
        });
      } else {
        res.json({
          message: data,
        });
      }
    }
  );
});

// edit data

app.put("/edit/:token",JWTverify, (req, res) => {
  db.query(
    "UPDATE project SET project_name=?, project_desc=?, project_status=? WHERE id=? AND project_email=?",
    [
      req.query.name,
      req.query.desc,
      req.query.status,
      req.query.id,
      req.query.email,
    ],
    (err, data) => {
      console.log(data);
      if (err) {
        console.log("error", err);
        res.json({ message: "Something went wrong" });
      } else {
        res.json({ message: "Updated successfully" });
      }
    }
  );
});

// delete data

app.delete("/delete/:token",JWTverify, (req, res) => {
  db.query(
    "DELETE FROM project WHERE project_email=? AND id=?",
    [req.query.email, req.query.id],
    (err, data) => {
      if (err) {
        console.log("error", err);
        res.json({
          message: "something went wrong",
        });
      } else {
        res.json({
          message: "Deleted successfully",
        });
      }
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});