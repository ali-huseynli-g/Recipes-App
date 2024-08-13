const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const passportJWT = require("passport-jwt");
const app = express();
const userService = require("./user-service.js");

const HTTP_PORT = process.env.PORT || 8080;

// JSON Web Token Setup
let ExtractJwt = passportJWT.ExtractJwt;
let JwtStrategy = passportJWT.Strategy;

// Configure its options
let jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
  secretOrKey:
    "&0y7$noP#5rt99&GB%Pz7j2b1vkzaB0RKs%^N^0zOP89NT04mPuaM!&G8cbNZOtH",
};

// IMPORTANT - this secret should be a long, unguessable string
// (ideally stored in a "protected storage" area on the web server).
// We suggest that you generate a random 50-character string
// using the following online tool:
// https://lastpass.com/generatepassword.php

let strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
  if (jwt_payload) {
    // The following will ensure that all routes using
    // passport.authenticate have a req.user._id, req.user.username, req.user.fullName & req.user.role values
    // that matches the request payload data
    next(null, {
      _id: jwt_payload._id,
      username: jwt_payload.username,
      email: jwt_payload.email,
    });
  } else {
    next(null, false);
  }
});

// tell passport to use our "strategy"
passport.use(strategy);

app.use(
  cors({
    origin: "https://recipes-app-client-gamma.vercel.app/",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

// add passport as application-level middleware
app.use(passport.initialize());

app.use(cors());
app.use(express.json());

app.post("/api/register", (req, res) => {
  userService
    .registerUser(req.body)
    .then((msg) => {
      res.json({ message: msg });
    })
    .catch((msg) => {
      res.status(422).json({ message: msg });
    });
});

app.post("/api/login", (req, res) => {
  userService
    .checkUser(req.body)
    .then((user) => {
      let payload = {
        _id: user._id,
        username: user.username,
        email: user.email,
      };

      let token = jwt.sign(payload, jwtOptions.secretOrKey);

      res.json({ message: "login successful", token: token });
    })
    .catch((msg) => {
      res.status(422).json({ message: msg });
    });
});

app.post("/api/favorites", (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ msg: "No data send" });
  }

  try {
    userService.addFavorite(req.body);
    res.json({ msg: "Favourite recipe was added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add favourite recipe" });
  }
});

app.get("/api/favorites", (req, res) => {
  try {
    userService.getFavorites().then((data) => res.json(data));
  } catch (error) {
    res.status(500).json({ error: "Failed to get favourite recipes" });
  }
});

app.delete("/api/favorites/:recipeLabel", async (req, res) => {
  try {
    const recipeLabel = req.params.recipeLabel;
    const deletedRecipe = userService.deleteFavorite(recipeLabel);

    if (!deletedRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete favourite recipe" });
  }
});

app.use((req, res) => {
  res.status(404).end();
});

userService
  .connect()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log("API listening on: " + HTTP_PORT);
    });
  })
  .catch((err) => console.log(err));
