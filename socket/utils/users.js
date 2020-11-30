const jwt = require("jsonwebtoken");
const User = require("../../models/User");

async function getUserInfo(token) {

  //Set token from Bearer token in header


  //Verify Token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    user = await User.findById(decoded.id);
    console.log(user);
    return user;
  } catch (err) {
    return err.message;
  }
}
async function getUserId(tokenId) {
  let token;

  //Set token from Bearer token in header
  token = tokenId.split(" ")[1];

  //Verify Token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    user = await User.findById(decoded.id);
    return user._id;
  } catch (err) {
    return err.message;
  }
}
module.exports = { getUserInfo, getUserId };
