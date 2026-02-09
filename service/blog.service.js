const mongoose = require("mongoose");
const Blog = require("../model/blog.model");

// helper: validate mongo id
const validateMongoId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("invalid blog id");
    error.statusCode = 400;
    throw error;
  }
};

// CREATE BLOG
const createBlog = async (payload, file) => {
  const { title, content, category, coverImage } = payload;

  if (!title || typeof title !== "string" || !title.trim()) {
    const error = new Error("title is required and must be a string");
    error.statusCode = 400;
    throw error;
  }

  if (!content || typeof content !== "string" || !content.trim()) {
    const error = new Error("content is required and must be a string");
    error.statusCode = 400;
    throw error;
  }

  if (!category || typeof category !== "string" || !category.trim()) {
    const error = new Error("category is required and must be a string");
    error.statusCode = 400;
    throw error;
  }

  if (coverImage && typeof coverImage !== "string") {
    const error = new Error("coverImage must be a string url");
    error.statusCode = 400;
    throw error;
  }

  const blog = await Blog.create({
    title: title.trim(),
    content: content.trim(),
    category: category.trim(),
    coverImage: file ? `/uploads/blogs/${file.filename}` : null,
  });

  return blog;
};

// GET ALL BLOGS
const getAllBlogs = async () => {
  const blogs = await Blog.find().sort({ createdAt: -1 });

  return blogs;
};

// GET BLOG BY ID
const getBlogById = async (id) => {
  validateMongoId(id);

  const blog = await Blog.findById(id);

  if (!blog) {
    const error = new Error("blog not found");
    error.statusCode = 404;
    throw error;
  }

  return blog;
};

// UPDATE BLOG
const updateBlog = async (id, payload) => {
  validateMongoId(id);

  const { title, content, coverImage, category } = payload;

  if (
    !title &&
    !content &&
    coverImage === undefined &&
    category === undefined
  ) {
    const error = new Error("at least one field is required to update");
    error.statusCode = 400;
    throw error;
  }

  const updateData = {};

  if (title !== undefined) {
    if (typeof title !== "string" || !title.trim()) {
      const error = new Error("title must be a non-empty string");
      error.statusCode = 400;
      throw error;
    }
    updateData.title = title.trim();
  }

  if (content !== undefined) {
    if (typeof content !== "string" || !content.trim()) {
      const error = new Error("content must be a non-empty string");
      error.statusCode = 400;
      throw error;
    }
    updateData.content = content.trim();
  }

  if (coverImage !== undefined) {
    if (coverImage !== null && typeof coverImage !== "string") {
      const error = new Error("coverImage must be a string url or null");
      error.statusCode = 400;
      throw error;
    }
    updateData.coverImage = file ? `/uploads/blogs/${file.filename}` : null;
  }

  if (category !== undefined) {
    if (typeof category !== "string" || !category.trim()) {
      const error = new Error("category must be a non-empty string");
      error.statusCode = 400;
      throw error;
    }
    updateData.category = category.trim();
  }

  const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!updatedBlog) {
    const error = new Error("blog not found");
    error.statusCode = 404;
    throw error;
  }

  return updatedBlog;
};

// DELETE BLOG
const deleteBlog = async (id) => {
  validateMongoId(id);

  const deletedBlog = await Blog.findByIdAndDelete(id);

  if (!deletedBlog) {
    const error = new Error("blog not found");
    error.statusCode = 404;
    throw error;
  }

  return true;
};

module.exports = {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
};
