const jwt = require("jsonwebtoken");

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      const err = new Error("username and password are required");
      err.statusCode = 400;
      throw err;
    }

    if (
      username !== process.env.ADMIN_USERNAME ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      const err = new Error("invalid admin credentials");
      err.statusCode = 401;
      throw err;
    }

    const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });

    res.status(200).json({
      success: true,
      message: "admin login successful",
      token,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { login };
