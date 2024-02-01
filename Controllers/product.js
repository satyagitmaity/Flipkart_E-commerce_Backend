const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const Product = require("../Models/product");
const Category = require("../Models/category");

//@desc     Create a product
//@route    GET/api/product/create
//@access   Admin
const createProduct = asyncHandler(async (req, res) => {
  try {
    const { name, price, quantity, description, category } = req.body;

    let productPictures = [];
    if (req.files.length > 0) {
      productPictures = req.files.map((file) => {
        return { img: file.filename };
      });
    }
    console.log(productPictures);
    const newProduct = await Product.create({
      name,
      slug: slugify(name),
      price,
      quantity,
      description,
      productPictures,
      category,
      createdBy: req.user._id,
    });
    res.status(201).json(newProduct);
  } catch (error) {
    throw new Error(error);
  }
});
//@desc     Get a product by slug
//@route    GET/api/product/:slug
//@access   Public
const getProductsBySlug = asyncHandler(async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ slug: slug }).select("_id");
    if (category) {
      const products = await Product.find({ category: category._id });
      if (products.length > 0) {
        res.status(200).json({
          products,
          priceRange: {
            under5k: 5000,
            under10k: 10000,
            under15k: 15000,
          },
          productsByPrice: {
            under5k: products.filter((product) => product.price <= 5000),
            under10k: products.filter(
              (product) => product.price > 5000 && product.price <= 10000
            ),
            under15k: products.filter(
              (product) => product.price > 10000 && product.price <= 15000
            ),
          },
        });
      }
    }
  } catch (error) {
    throw new Error(error);
  }
});
//@desc     Get a product by id
//@route    GET/api/product/:id
//@access   Public
const getProducDetailsById = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.params;
    if (productId) {
      const product = await Product.findOne({ _id: productId });
      res.status(200).json({ product });
    }
  } catch (error) {
    throw new Error(error);
  }
});
//@desc     Delete a product
//@route    DELETE/api/product/deleteProductById
//@access   Admin
const deleteProductById = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.body.payload;
    if (productId) {
      const deletedProduct = await Product.deleteOne({ _id: productId });
      res.status(200).json({
        massage: "Product deleted successfully",
        deletedProduct,
      });
    }
  } catch (error) {
    throw new Error(error);
  }
});
//@desc     Get all products by admin
//@route    GET/api/product/getProducts
//@access   Admin
const getProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({ createdBy: req.user._id })
      .select(
        "_id name price quantity slug desription productPictures category"
      )
      .populate("category", "_id name");
    console.log(products);
    res.status(200).json({ products });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createProduct,
  getProductsBySlug,
  getProducDetailsById,
  deleteProductById,
  getProducts,
};
