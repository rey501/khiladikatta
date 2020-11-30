const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");

//@desc    Register a User
//@route   Post /api/auth
//@access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, mobile, password, deviceId } = req.body;

  const user = await User.create({ name, email, mobile, password, deviceId });

  sendTokenResponse(user, 200, res);
});

//@desc    Register a FacebookUser
//@route   Post /api/auth/facebook
//@access  Public
exports.registerFacebook = asyncHandler(async (req, res, next) => {
  const { name, email, facebookId, profilePic, deviceId } = req.body;
  let user;

  if (email) {
    user = await User.findOne({ email });
    if (user) {
      await User.findByIdAndUpdate(
        user._id,
        { facebookId, profilePic },
        {
          new: true,
          validateBeforeSave: false,
        }
      );
      if (!user.isActive) {
        return next(
          new ErrorResponse(
            "Your Account is temporarily Blocked Please contact Support teams"
          )
        );
      }
      sendTokenResponse(user, 200, res);
    } else if (facebookId != null) {
      user = await User.findOne({ facebookId });
      console.log(user);
      if (!user) {
        user = new User({
          name,
          email,
          facebookId,
          profilePic,
          deviceId,
        });

        user = await user.save({ validateBeforeSave: false });
      }

      sendTokenResponse(user, 200, res);
    }
  } else if (facebookId != null) {
    user = await User.findOne({ facebookId });
    console.log(user);
    if (!user) {
      user = new User({
        name,
        email,
        facebookId,
        profilePic,
        deviceId,
      });
      user = await user.save({ validateBeforeSave: false });
    } else if (!user.isActive) {
      return next(
        new ErrorResponse(
          "Your Account is temporarily Blocked Please contact Support teams"
        )
      );
    }
    sendTokenResponse(user, 200, res);
  }
});

//@desc     Login user
//@route    Post /api/auth/login
//@access   public

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  //email and password fields are required
  if (!email || !password) {
    return next(
      new ErrorResponse("Email and password fields must be required"),
      400
    );
  }
  //Check for user
  const user = await User.findOne({
    $and: [{ $or: [{ email }, { mobile: email }] }, { password }],
  });

  if (!user) {
    return next(new ErrorResponse("Invalide credentials", 401));
  }
  if (!user.isActive) {
    return next(
      new ErrorResponse(
        "Your Account is temporarily Blocked Please contact Support teams"
      )
    );
  }
  sendTokenResponse(user, 200, res);
});

///@desc    Log user out/ clear cookie
//@route    GET /api/auth/logout
//@access   Private

exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", "none", {
    httpOnly: true,
  });

  res.status(200).json({ success: true, data: {} });
});

///@desc     Get current logged in user
//@route    GET /api/auth/me
//@access   private

exports.getMe = asyncHandler(async (req, res, next) => {
  console.log(req.user.id);
  const user = await User.findById(req.user.id);
  res.status(200).json({ success: true, data: user });
});

///@desc     Update user details
//@route    PUT /api/auth/updatedetails
//@access   private

exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    music: req.body.music,
    sound: req.body.sound,
    vibration: req.body.vibration,
    avtarId: req.body.avtarId,
  };
  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, data: user });
});

///@desc     Update Password
//@route    PUT /api/auth/updatepassword
//@access   private

exports.updatePassword = asyncHandler(async (req, res, next) => {
  if (!req.body.currentPassword || !req.body.newPassword) {
    next(
      new ErrorResponse(
        "currentPassword and newPassword fields must be filled",
        401
      )
    );
  }
  const user = await User.findOne({
    $and: [{ _id: req.user.id }, { password: req.body.currentPassword }],
  });
  //Check current password (matchPassword method defined in User models)
  if (!user) {
    next(new ErrorResponse(`Password is incorrect`, 401));
  }
  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});

//Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  //Create Token
  const token = user.getSignedJwtToken();
  const options = {
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, token, data: user });
};
