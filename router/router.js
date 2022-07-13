const router = require("express").Router();
const { signup, signupValidate } = require("../controller/signup.controller");
const { login, loginValidate } = require("../controller/login.controller");
const { renderDashboard,submitTask} = require("../controller/dashboard.controller");
const { sendNotification } = require("../controller/notification.controller");
const {isAuth} = require("../middlewear/jwtMiddlewear")


router.get("/", (req, res) => {
  if (req.session.isLoggedIn == true) {
    return res.redirect("/dashboard");
  }
  return res.render("index.html");
}); 

router.get("/signup", signup);
router.post("/signup", signupValidate);

router.get("/login", login);
router.post("/login", loginValidate);

router.get("/dashboard",renderDashboard);
router.post("/dashboard",isAuth,submitTask);

router.post("/notify",isAuth,sendNotification);

router.get("/logout", (req, res) => {
  req.session.isLoggedIn = false;
  res.redirect("/");
});

router.get("*", (req, res) => {
  res.redirect("/");
});

module.exports = router;
