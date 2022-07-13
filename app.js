const express = require("express");
const { engine } = require("express-handlebars");
const routes = require("./router/router");
const session = require("express-session");
const app = express();

app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

app.use(
  session({
    secret: "Luffy",
    resave: false,
    saveUninitialized: true,
    cookie: {},
  })
);

app.use(routes);

app.listen(3000, () => {
  console.log("[Listening at PORT 3000] . . .");
});