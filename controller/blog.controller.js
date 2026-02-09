const blogService = require("../service/blog.service");

const createBlog = async (req, res, next) => {
  try {
    const blog = await blogService.createBlog(req.body, req.file);

    res.status(201).json({
      success: true,
      message: "blog created successfully",
      data: blog,
    });
  } catch (error) {
    next(error);
  }
};

const getAllBlogs = async (_req, res, next) => {
  try {
    const blogs = await blogService.getAllBlogs();

    res.status(200).json({
      success: true,
      message: "blogs fetched successfully",
      data: blogs,
    });
  } catch (error) {
    next(error);
  }
};

const getBlogById = async (req, res, next) => {
  try {
    const blog = await blogService.getBlogById(req.params.id);

    res.status(200).json({
      success: true,
      message: "blog fetched successfully",
      data: blog,
    });
  } catch (error) {
    next(error);
  }
};

const updateBlog = async (req, res, next) => {
  try {
    const blog = await blogService.updateBlog(
      req.params.id,
      req.body,
      req.file,
    );

    res.status(200).json({
      success: true,
      message: "blog updated successfully",
      data: blog,
    });
  } catch (error) {
    next(error);
  }
};

const deleteBlog = async (req, res, next) => {
  try {
    await blogService.deleteBlog(req.params.id);

    res.status(200).json({
      success: true,
      message: "blog deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
};
