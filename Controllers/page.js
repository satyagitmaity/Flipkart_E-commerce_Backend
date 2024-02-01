const asyncHandler = require("express-async-handler");
const Page = require("../Models/page");
//@desc     Create a page
//@route    POST/api/page/create
//@access   Admin
const createPage = asyncHandler(async (req, res) => {
  try {
    const { banners, products } = req.files;
    if (banners.length > 0) {
      req.body.banners = banners.map((banner, index) => ({
        img: `${process.env.API}/public/${banner.filename}`,
        navigateTo: `/bannerClicked?categoryId=${req.body.category}&type=${req.body.type}`,
      }));
    }
    if (products.length > 0) {
      req.body.products = products.map((product, index) => ({
        img: `${process.env.API}/public/${product.filename}`,
        navigateTo: `/productClicked?categoryId=${req.body.category}&type=${req.body.type}`,
      }));
    }
    req.body.createdBy = req.user._id;
    const findPage = await Page.findOne({ category: req.body.category });
    if (findPage) {
      const updatedPage = await Page.findOneAndUpdate(
        { category: req.body.category },
        req.body,
        {
          new: true,
        }
      );
       res.status(201).json({ updatedPage });
    } else {
      const page = await Page.create(req.body);
      res.status(200).json(page);
    }
  } catch (error) {
    throw new Error(error);
  }
});
//@desc     Get a page
//@route    GET/api/page/getPage/:category/:type
//@access   Public
const getPage = asyncHandler(async (req, res) => {
    try {
        const { category, type } = req.params;
        if (type === "page") {
            const page = await Page.findOne({ category })
            res.status(200).json({page})
        }
    } catch (error) {
       throw new Error(error) 
    }
})
module.exports = {
    createPage,
    getPage
};
