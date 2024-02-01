const asyncHandler = require("express-async-handler");
const UserAddress = require("../Models/address");

//@desc     Add an adress
//@route    POST/user/address/create
//@access   User
const addAddress = asyncHandler(async (req, res) => {
  try {
    const { payload } = req.body;
    if (payload.address) {
      if (payload.address._id) {
        const address = await UserAddress.findOneAndUpdate(
          {
            user: req.user._id,
            "address._id": payload.address._id,
          },
          {
            $set: {
              "address.$": payload.address,
            },
          },
          { new: true }
        );
        res.status(201).json({ address });
      } else {
        const newAddress = await UserAddress.findOneAndUpdate(
          { user: req.user._id },
          {
            $push: {
              address: payload.address,
            },
          },
          { new: true, upsert: true }
        );
        res.status(201).json({ newAddress });
      }
    }
  } catch (error) {
    throw new Error(error);
  }
});
//@desc     GET an adress
//@route    GET/user/address/getAddress
//@access   User
const getAddress = asyncHandler(async (req, res) => {
  try {
    const userAddress = await UserAddress.findOne({ user: req.user._id });
    res.status(200).json({ userAddress });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  addAddress,
  getAddress,
};
