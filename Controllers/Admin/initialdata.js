const asyncHandler = require("express-async-handler");
const Category = require("../../Models/category");
const Products = require("../../Models/product");
const Order = require("../../Models/order");

function createCategories(categories, parentId = null) {
  const categoryList = [];
  let category;
  if (parentId == null) {
    category = categories.filter((cat) => cat.parentId == undefined);
  } else {
    category = categories.filter((cat) => cat.parentId == parentId);
  }
  for (let cate of category) {
    categoryList.push({
      _id: cate._id,
      name: cate.name,
      slug: cate.slug,
      parentId: cate.parentId,
      children: createCategories(categories, cate._id),
    });
  }
  return categoryList;
}
//@desc     Get all initial data
//@route    GET/api/ainitialdata
//@access   Admin
const initialData = asyncHandler(async (req, res) => {
  try {
    const categories = await Category.find({}).exec();
    const products = await Products.find({})
      .select("_id name category price quantity slug productPictures")
      .populate({ path: "category", select: "_id name" })
      .exec();
    const orders = await Order.find({}).populate("items.productId", "name");
    res.status(200).json({
      categories: createCategories(categories),
      products : products,
      orders : orders,
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  initialData,
};
