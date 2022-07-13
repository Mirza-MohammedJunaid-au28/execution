const { dbConnection } = require("../db/mongodb");
const { jwtKey } = require("../config/config.json")
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')

function login(req, res) {
  try {
    return res.status(200).render("login");
  } catch (err) {
    console.log("Login Controller Error", err);
    return res.status(500).render("errors/something");
  }
}

async function loginValidate(req, res) {
  const { email, password } = req.body;
  try {
    const conn = await dbConnection();
    const result = await conn.findOne({ email: email });
    if (!result) {
      return res.status(404).send({ error: true, msg: "User Not Exists" });
    }
    const ans = await bcrypt.compare(password, result.password);
    if (!ans) {
      return res.status(401).send({ error: true, msg: "Unauthorizsed" });
    }
    req.session.isLoggedIn = true;
    const payload = {
      email
    };
    const token = jwt.sign(payload,jwtKey,{expiresIn : '30d'})
    return res.status(200).send({ error: false, token: token});
  } catch (err) {
    console.log("Login Controller Error while Validation ", err);
    return res.status(500).render('errors/something');
  }
}

module.exports = { login, loginValidate };