const asyncHandler = require("express-async-handler");
const Order = require("../../Models/order");

//@desc     Update an Order
//@route    POST/api/order/update
//@access   Admin
const updateOrder = asyncHandler(async (req, res) => {
  try {
    const order = await Order.updateOne(
      {
        _id: req.body.orderId,
        "orderStatus.type": req.body.type,
      },
      {
        $set: {
          "orderStatus.$": [
            { type: req.body.type, date: new Date(), isCompleted: true },
          ],
        },
      }
    );
    res.status(201).json({ order });
  } catch (error) {
    throw new Error(error);
  }
});
//@desc     Get all customers orders
//@route    GET/api/order/getCustomersOrders
//@access   Admin
const getCustomersOrders = asyncHandler(async (req, res) => {
    try {
        const orders = await Order.find({}).populate("items.productId", "name")
        res.status(200).json({orders})
    } catch (error) {
       throw new Error(error) 
    }
})

module.exports = {
    updateOrder,
    getCustomersOrders
};
