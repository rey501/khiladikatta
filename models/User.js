const mongoose = require("mongoose");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    facebookId: String,
    profilePic: String,
    email: {
      type: String,
      required: [true, "Please add an email"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add valid email",
      ],
    },
    mobile: {
      type: String,
      required: [true, "Please add mobile number"],
      match: [/^(\+\d{1,3}[- ]?)?\d{10}$/, "Please add valid mobile number"],
    },

    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: 6,
    },
    avtarId: {
      type: Number,
      default: Math.floor(Math.random() * 21) + 1,
    },
    totalGamesPlayed: {
      type: Number,
      default: 0,
    },
    golds: {
      type: Number,
      default: 50000,
    },
    lastReward: {
      type: Number,
      default: 0,
    },
    diamonds: {
      type: Number,
      default: 0,
    },
    deviceId: String,
    isLogin: {
      type: Number,
      default: 0,
    },
    type: {
      type: String,
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
// //Encrypt password us bcrypt
// UserSchema.pre("save", async function () {
//     //this condition used when forgot password
//     if (!this.isModified("password")) {
//         next();
//     }
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
// });

//Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    // expiresIn: process.env.JWT_EXPIRE,
  });
};

// //Match user entered password and hash password in database
// UserSchema.methods.matchPassword = async function (enteredPassword) {
//     return await bcrypt.compare(enteredPassword, this.password);
// };

//Genrate and hash password token
UserSchema.methods.getResetPasswordToken = function () {
  //Genrate Token
  const resetToken = crypto.randomBytes(20).toString("hex");

  //Hask token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  //Set expire
  // this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; //10 minutes
  return resetToken;
};
module.exports = mongoose.model("User", UserSchema);
