const jwt = require("jsonwebtoken");

const adminAuth = (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      const err = new Error("authorization token missing");
      err.statusCode = 401;
      throw err;
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET);

    next();
  } catch (error) {
    error.statusCode = 401;
    next(error);
  }
};

module.exports = adminAuth;
