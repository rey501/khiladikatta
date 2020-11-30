const ErrorResponse = require("../utils/errorResponse");
const errorHandler = (err, req, res, next) => {
  let error = err;
  //Log to console for dev
  console.log(err);

  //Mongoose bed objectId
  if (err.name === "CastError") {
    const message = `Resource not found `;
    error = new ErrorResponse(message, 404);
  }

  //Mongoose duplicates key
  if (err.code === 11000) {
    let message = "";
    if (err.keyValue.email)
      message = `${err.keyValue.email} User is already exists`;
    else   if (err.keyValue.mobile)
      message = `${err.keyValue.mobile} User is already exists`;
    
    else
      message = `Duplicate field value entered ${JSON.stringify(err.keyValue)}`;
    error = new ErrorResponse(message, 400);
  }

  //Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => {
      return val.message;
    });
    error = new ErrorResponse(message, 400);
  }
  res
    .status(error.statusCode || 500)
    .json({ success: false, error: error.message || "Server Error" });
};

module.exports = errorHandler;
