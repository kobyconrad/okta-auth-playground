const express = require("express");
const path = require("path");

const app = express();

require("dotenv").config();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(express.urlencoded({ extended: true }));
app.use("/static", express.static("public"));

// @TODO add auth middleware // done below
app.use(
  require("express-session")({
    secret: process.env.APP_SECRET,
    resave: true,
    saveUninitialized: false,
  })
);

const { ExpressOIDC } = require("@okta/oidc-middleware");
const oidc = new ExpressOIDC({
  issuer: `${process.env.OKTA_ORG_URL}/oauth2/default`,
  client_id: process.env.OKTA_CLIENT_ID,
  client_secret: process.env.OKTA_CLIENT_SECRET,
  redirect_uri: `${process.env.HOST_URL}/authorization-code/callback`,
  scope: "openid profile",
});

app.use(oidc.router);

// @TODO add registration page // done below
app.use("/register", require("./routes/register"));

// @TODO add logout route

app.use("/", require("./routes/index"));

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`App listening on port ${port}`));
