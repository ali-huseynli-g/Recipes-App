const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

let mongoDBConnectionString =
  "mongodb+srv://alihuseynlig:2NlfYbCS4sFRXnE0@users.fueys.mongodb.net/?retryWrites=true&w=majority&appName=Users";

let Schema = mongoose.Schema;

let userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const favoritesSchema = new mongoose.Schema({
  recipeLabel: { type: String, required: true, unique: true },
  url: { type: String, required: true, unique: true },
});

let User;
let Favorites;

module.exports.connect = function () {
  return new Promise(function (resolve, reject) {
    let db = mongoose.createConnection(mongoDBConnectionString);

    db.on("error", (err) => {
      reject(err); // reject the promise with the provided error
    });

    db.once("open", () => {
      User = db.model("users", userSchema);
      Favorites = db.model("Favorites", favoritesSchema);
      resolve();
    });
  });
};

module.exports.addFavorite = function (recipeData) {
  return new Promise(function (resolve, reject) {
    const { recipeLabel, url } = recipeData;
    let newFavorite = new Favorites({ recipeLabel, url });

    newFavorite
      .save()
      .then(() => {
        resolve("Recipe " + recipeLabel + " successfully added");
      })
      .catch((err) => {
        if (err.code == 11000) {
          reject("Favorite already exists");
        } else {
          reject("There was an error adding favorite: " + err);
        }
      });
  });
};

module.exports.deleteFavorite = function (recipeLabel) {
  return new Promise(async function (resolve, reject) {
    try {
      const deletedRecipe = await Favorites.findOneAndDelete({
        recipeLabel: recipeLabel,
      });

      resolve(deletedRecipe);
    } catch (err) {
      reject("There was an error getting favorites: " + err);
    }
  });
};

module.exports.getFavorites = function () {
  return new Promise(async function (resolve, reject) {
    try {
      const data = await Favorites.find();
      resolve(data);
    } catch (err) {
      reject("There was an error getting favorites: " + err);
    }
  });
};

module.exports.registerUser = function (userData) {
  return new Promise(function (resolve, reject) {
    if (userData.password != userData.password2) {
      reject("Passwords do not match");
    } else {
      bcrypt
        .hash(userData.password, 10)
        .then((hash) => {
          // Hash the password using a Salt that was generated using 10 rounds

          userData.password = hash;

          const { username, email, password } = userData;
          let newUser = new User({ username, email, password });

          newUser
            .save()
            .then(() => {
              resolve("User " + userData.username + " successfully registered");
            })
            .catch((err) => {
              if (err.code == 11000) {
                reject("User Name already taken");
              } else {
                reject("There was an error creating the user: " + err);
              }
            });
        })
        .catch((err) => reject(err));
    }
  });
};

module.exports.checkUser = function (userData) {
  return new Promise(function (resolve, reject) {
    User.find({ username: userData.username })
      .limit(1)
      .exec()
      .then((users) => {
        if (users.length == 0) {
          reject("Unable to find user " + userData.username);
        } else {
          bcrypt.compare(userData.password, users[0].password).then((res) => {
            if (res === true) {
              resolve(users[0]);
            } else {
              reject("Incorrect password for user " + userData.username);
            }
          });
        }
      })
      .catch((err) => {
        reject("Unable to find user " + userData.username);
      });
  });
};
