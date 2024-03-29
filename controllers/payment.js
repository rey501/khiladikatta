const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const Order = require("../models/Order");
const path = require("path");
var request = require("request");
const { io } = require("../server");
const shortid = require("shortid");
const Razorpay = require("razorpay");
const User = require("../models/User");
const format = require("format");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

//@desc    Payment for the coin
//@route   Post /api/payment
//@access  Private
exports.addPayment = asyncHandler(async (req, res, next) => {
  const payment_capture = 1;
  const amount = req.query.amount;
  const currency = "INR";

  const user = await User.findById(req.query.id);
  console.log("************", user);
  console.log(user.name);

  const options = {
    amount: amount * 100,
    currency,
    receipt: shortid.generate(),
    payment_capture,
  };

  try {
    const response = await razorpay.orders.create(options);
    await Order.create({
      user: user._id,
      amount: amount / 100,
      orderId: response.id,
    });
    console.log("This is orde...", response.id);
    res.render("payment", {
      key: process.env.RAZORPAY_KEY,
      name: user.name,
      email: user.email,
      user: user._id,
      order_id: response.id,
      amount: response.amount,
      currency: response.currency,
      mobile: user.mobile,
    });

    // res.json({
    //   id: response.id,
    //   currency: response.currency,
    //   amount: response.amount,
    // });
  } catch (error) {
    console.log(error);
  }
});

exports.successPayment = asyncHandler(async (req, res, next) => {
  console.log(req.body);

  const amount = req.query.amount;
  const paymentId = req.body.razorpay_payment_id;
  let status = "No payment!";
  // request(
  //     `https://${process.env.RAZORPAY_KEY}:${process.env.RAZORPAY_SECRET}@api.razorpay.com/v1/payments/${req.body.razorpay_payment_id}`,
  //     function (error, response, body) {
  //         console.log("Response:", body);
  //     }
  // );
  const order = await Order.findOne({ orderId: req.body.razorpay_order_id });
  console.log("****************", order);
  if (order.status == "pending") {
    console.log("sandip shiroya");
    request(
      {
        method: "POST",
        url: `https://${process.env.RAZORPAY_KEY}:${process.env.RAZORPAY_SECRET}@api.razorpay.com/v1/payments/${req.body.razorpay_payment_id}/capture`,
        form: {
          amount,
          currency: "INR",
        },
      },
      async function (error, response, body) {
        console.log("Status:", response.statusCode);
        console.log("Headers:", JSON.stringify(response.headers));
        body = JSON.parse(body);
        console.log("Response:", body);

        if (
          response.statusCode == 200 ||
          body.error.description.includes("already been captured")
        ) {
          await Order.findByIdAndUpdate(order._id, {
            status: "success",
            amount: amount / 100,
            paymentId,
          });
          //$inc: { diamonds: amount / 100 },
          var gold = amount / 100;
          /* if (amount / 100 == 20) gold = 500;
          else if (amount / 100 == 40) gold = 1000;
          else if (amount / 100 == 150) gold = 5000;
          else if (amount / 100 == 300) gold = 10000;
          else if (amount / 100 == 500) gold = 20000; */

          await User.findByIdAndUpdate(order.user, {
            $inc: { golds: gold },
          });

          status = `Payment successfully completed your payment id is ${paymentId}`;
          res.sendFile("public/success.html", { root: __dirname });
        } else {
          await Order.findByIdAndUpdate(Order._id, {
            status: "failed",
            amount,
            paymentId,
          });
          status = `Payment is failed! Please contact support! your payment id is ${paymentId}`;
          return res.sendFile("public/fail.html", { root: __dirname });
        }
      }
    );
  }
});

//@desc    Payment History
//@route   Get /api/payment/view
//@access  Private
exports.paymentView = asyncHandler(async (req, res, next) => {
  const user = req.user.id;

  const withdraw = await Order.find({ user }).sort({ created_at: -1 });

  res.status(200).json({ success: true, data: withdraw });
});

//@desc    Add coin when User is won
//@route   Post /api/payment/winAmount
//@access  Private
exports.winAmount = asyncHandler(async (req, res, next) => {
  const betAmount = req.body.betAmount;
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      $inc: { golds: betAmount },
    },
    { new: true }
  );
  console.log("UserData", user);
  res.status(200).json({ success: true, data: user });
});

//@desc    Add coin when User is won
//@route   Post /api/payment/addReward
//@access  Private
exports.addReward = asyncHandler(async (req, res, next) => {
  //const rewardAmount = req.body.rewardAmount;

  const user = await User.findById(req.user.id);
  let lastDay =
    user.updatedAt.getMonth() +
    1 +
    "/" +
    user.updatedAt.getDate() +
    "/" +
    user.updatedAt.getFullYear();
  console.log(lastDay);
  lastDay = new Date(lastDay).getTime() / 1000 / 60 / 60 / 24;
  let currentDay = new Date().getTime() / 1000 / 60 / 60 / 24;
  console.log(lastDay, " : ", currentDay, " : ", currentDay - lastDay);
  let lastReward = user.lastReward;
  let rewardAmount = lastReward;
  if (currentDay - lastDay > 1 && currentDay - lastDay < 2) {
    if (lastReward > 5000 && lastReward < 50000) rewardAmount += 10000;
    else if (lastReward === 50000) rewardAmount += 50000;
    else rewardAmount += 5000;
  } else {
    rewardAmount = 5000;
  }
  user = await User.findByIdAndUpdate(
    req.user.id,
    {
      $inc: { golds: rewardAmount },
      lastReward: rewardAmount,
    },
    { new: true }
  );

  res.status(200).json({ success: true, data: user });
});
