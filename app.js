const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// health check
app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "blog api is running",
  });
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// routes
app.use("/api/blogs", require("./routes/blog.routes"));
app.use("/admin", require("./routes/admin.routes"));

// global error fallback
app.use((err, _req, res, _next) => {
  console.error(err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "internal server error",
  });
});

module.exports = app;
