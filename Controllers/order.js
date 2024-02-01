const asyncHandler = require("express-async-handler");
const Order = require("../Models/order");
const Cart = require("../Models/cart");
const Address = require("../Models/address")

//@desc     Create an order
//@route    POST/api/addOrder
//@access   User
const addOrder = asyncHandler(async (req, res) => {
  try {
    const deletedCart = await Cart.deleteOne({ user: req.user._id });
    req.body.user = req.user._id;
    if (deletedCart) {
      req.body.orderStatus = [
        {
          type: "ordered",
          date: new Date(),
          isCompleted: true,
        },
        {
          type: "packed",
          isCompleted: false,
        },
        {
          type: "shipped",
          isCompleted: false,
        },
        {
          type: "delivered",
          isCompleted: false,
        },
      ];
      const order = await Order.create(req.body);
      res.status(201).json({ order });
    }
  } catch (error) {
    throw new Error(error);
  }
});
//@desc     Get all orders by user
//@route    GET/api/getOrders
//@access   User
const getOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .select("_id paymentStatus items")
      .populate("items.productId", "_id name productPictures");
    res.status(200).json({ orders });
  } catch (error) {
    throw new Error(error);
  }
});
//@desc     Get single order details by a user
//@route    POST/api/getOrder
//@access   User
const getOrder = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.body.orderId })
      .populate("items.productId", "_id name productPictures")
      .lean(); // This method is used to convert a mongoose document to a plain JS object. To bind more properties with it.
    if (order) {
      const address = await Address.findOne({ user: req.user._id })
      order.address = address.address.find((adr) => adr._id.toString() === order.addressId.toString())
      res.status(200).json({order})
    }
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  addOrder,
  getOrders,
  getOrder
};
