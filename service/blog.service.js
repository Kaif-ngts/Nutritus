const mongoose = require("mongoose");
const Blog = require("../model/blog.model");
const cloudinary = require("../config/cloudinary");
const { uploadToCloudinary } = require("../utils/cloudinaryUpload");

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
  const { title, content, category } = payload;

  if (!title?.trim()) {
    throw Object.assign(new Error("title is required"), { statusCode: 400 });
  }

  if (!content?.trim()) {
    throw Object.assign(new Error("content is required"), { statusCode: 400 });
  }

  if (!category?.trim()) {
    throw Object.assign(new Error("category is required"), { statusCode: 400 });
  }

  let imageData = { url: null, public_id: null };

  if (file) {
    const uploadResult = await uploadToCloudinary(file.buffer);

    imageData = {
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
    };
  }

  const blog = await Blog.create({
    title: title.trim(),
    content: content.trim(),
    category: category.trim(),
    coverImage: imageData,
  });

  return blog;
};

// GET ALL BLOGS
const getAllBlogs = async () => {
  const blogs = await Blog.find().sort({ createdAt: -1 });
  console.log(blogs);

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
const updateBlog = async (id, payload, file) => {
  validateMongoId(id);

  const blog = await Blog.findById(id);

  if (!blog) {
    throw Object.assign(new Error("blog not found"), { statusCode: 404 });
  }

  const { title, content, category } = payload;

  if (title !== undefined) blog.title = title.trim();
  if (content !== undefined) blog.content = content.trim();
  if (category !== undefined) blog.category = category.trim();

  if (file) {
    // delete old image from cloudinary

    if (blog.coverImage?.public_id) {
      await cloudinary.uploader.destroy(blog.coverImage.public_id);
    }

    const uploadResult = await uploadToCloudinary(file.buffer);

    blog.coverImage = {
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
    };
  }

  await blog.save();
  return blog;
};

// DELETE BLOG
const deleteBlog = async (id) => {
  validateMongoId(id);

  const blog = await Blog.findById(id);

  if (!blog) {
    throw Object.assign(new Error("blog not found"), { statusCode: 404 });
  }

  if (blog.coverImage?.public_id) {
    await cloudinary.uploader.destroy(blog.coverImage.public_id);
  }

  await blog.deleteOne();
};

module.exports = {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
};
