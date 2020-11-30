const User = require("../../models/User");
const History = require("../../models/History");
async function placeBet(userId, betAmount) {
  try {
    const user = await User.findByIdAndUpdate(userId, {
      $inc: { amount: betAmount },
    });
    return user.amount;
  } catch (err) {
    console.log("error appear", err);
  }
}

async function addHistory(userId, betAmount) {
  try {
    await History.create({ user: userId, amount: betAmount });
  } catch (err) {
    console.log("error appear", err);
  }
}

module.exports = { placeBet, addHistory };
