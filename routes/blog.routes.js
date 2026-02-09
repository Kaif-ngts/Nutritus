const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth");
const upload = require("../config/multer");
const blogController = require("../controller/blog.controller");

// CREATE
router.post(
  "/",
  adminAuth,
  upload.single("coverImage"),
  blogController.createBlog,
);

// READ
router.get("/", blogController.getAllBlogs);
router.get("/:id", blogController.getBlogById);

// UPDATE
router.put(
  "/:id",
  adminAuth,
  upload.single("coverImage"),
  blogController.updateBlog,
);

// DELETE
router.delete("/:id", adminAuth, blogController.deleteBlog);

module.exports = router;
