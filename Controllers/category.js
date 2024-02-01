const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const Category = require("../Models/category");
const shortid = require("shortid");

//Function to get all categories in chain
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
      children: createCategories(categories, cate._id),
    });
  }
  return categoryList;
}
//@desc     Create a category
//@route    POST/api/category/create
//@access   Admin
const addCategory = asyncHandler(async (req, res) => {
  try {
    const categoryObj = {
      name: req.body.name,
      slug: `${slugify(req.body.name)}-${shortid.generate()}`,
    };
    if (req.body.parentId) {
      categoryObj.parentId = req.body.parentId;
    }
    if (req.file) {
      categoryObj.categoryImage =
        process.env.API + "/public/" + req.file.filename;
    }
    const category = await Category.create(categoryObj);
    res.status(201).json(category);
  } catch (error) {
    throw new Error(error);
  }
});
//@desc     Get all categories
//@route    POST/api/category/getcategory
//@access   Admin
const getCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await Category.find();
    const categoryList = createCategories(categories);
    res.status(200).json(categoryList);
  } catch (error) {
    throw new Error(error);
  }
});
//@desc     Update a category
//@route    POST/api/category/update
//@access   Admin
const updateCategories = asyncHandler(async (req, res) => {
  try {
    const { _id, name, parentId, type } = req.body;
    const updatedCategories = [];
    if (name instanceof Array) {
      for (let i = 0; i < name.length; i++) {
        const category = {
          name: name[i],
          type: type[i],
          slug: slugify(name[i]),
        };
        if (parentId[i] !== "") {
          category.parentId = parentId[i];
        }
        const updatedCategory = await Category.findOneAndUpdate(
          { _id: _id[i] },
          category,
          { new: true }
        );
        updatedCategories.push(updatedCategory);
      }
      return res.status(201).json({ updatedCategories });
    } else {
      const category = {
        name,
        type,
        slug: slugify(name),
      };
      if (parentId !== "") {
        category.parentId = parentId;
      }
      const updatedCategory = await Category.findOneAndUpdate(
        { _id: _id },
        category,
        { new: true }
      );
      return res.status(201).json({ updatedCategory });
    }
  } catch (error) {
    throw new Error(error);
  }
});
//@desc     Delete a category
//@route    POST/api/category/delete
//@access   Admin
const deleteCategory = asyncHandler(async (req, res) => {
    //Code : While Conneced with frontend.
    // try {
    //     const { ids } = req.body.payload;
    //     const deletedCategories = []
    //     for (let i = 0; i < ids.length; i++){
    //         const deletedCategory = await Category.findOneAndDelete({ _id: ids[i]._id })
    //         deletedCategories.push(deletedCategory)
    //     }
    //     if (deletedCategories.length == ids.length) {
    //         res.status(200).json({message : "Categories removed",  body: req.body })
    //     } else {
    //         res.status(400).json({message : "Something went wrong"})
    //     }
    // } catch (error) {
    //     throw new Error(error)
    // }
    
    //Testing code.
    try {
        const { _id } = req.body;
        const deletedCategory = await Category.findOneAndDelete({ _id })
        res.status(200).json({deletedCategory})
    } catch (error) {
        throw new Error(error)
    }
});
module.exports = {
  addCategory,
  getCategories,
  updateCategories,
  deleteCategory,
};
