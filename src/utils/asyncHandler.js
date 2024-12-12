const asyncHandler = (requestHandler) => {
 return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).reject((err) => next(err));
  };
};

export { asyncHandler };

//asyncHandler is a wrapper which holds a function inside it so that specific function can be easily called anywhere in the database

// ++++++++++ another method to declare asyncHandler ++++++++++

// const asyncHand = (fn) => async (req, res, next) => {
//   try {
//     await fn(req, res, next);
//   } catch (error) {
//     res.status(err.code || 500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };
