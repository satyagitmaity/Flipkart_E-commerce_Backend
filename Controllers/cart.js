const asyncHandler = require("express-async-handler");
const Cart = require("../Models/cart");

const runUpdate = (condition, update) => {
  return new Promise((resolve, reject) => {
    Cart.findOneAndUpdate(condition, update, { new: true })
      .then((result) => resolve())
      .catch((err) => reject(err));
  });
};
//@desc     Add item to Cart
//@route    POST/api/user/cart/addtocart
//@access   User
const addItemToCart = asyncHandler(async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      //If cart is already exists then update the cart by quantity
      //   let _cart;
      //   const product = req.body.cartItems.product;
      //   const isItemAdded = cart.cartItems.find((c) => c.product == product);
      //   let condition, update;
      //   if (isItemAdded) {
      //     condition = {
      //       user: req.user._id,
      //       "cartItems.product": req.body.cartItems.product,
      //     };
      //     update = {
      //       $set: {
      //         "cartItems.$": {
      //           ...req.body.cartItems,
      //           quantity: isItemAdded.quantity + req.body.cartItems.quantity,
      //         },
      //       },
      //     };
      //   } else {
      //     condition = { user: req.user._id };
      //     update = {
      //       $push: {
      //         cartItems: req.body.cartItems,
      //       },
      //     };
      //   }
      //   _cart = await Cart.findOneAndUpdate(condition, update);
      //     res.status(200).json({ _cart });
      // } else {
      //   //If cart is not exist then create a new cart
      //   const newCart = await Cart.create({
      //     user: req.user._id,
      //     cartItems: [req.body.cartItems],
      //   });
      //   res.status(201).json(newCart);

      // =>> New Code : ------------>
      let promiseArray = [];
      let updatedCart;
      [req.body.cartItems].forEach(async (cartItem) => {
        const product = cartItem.product;
        const availableItem = cart.cartItems.find((c) => c.product == product);
        let condition, update;
        if (availableItem) {
          condition = {
            user: req.user._id,
            "cartItems.product": product,
          };
          update = {
            $set: {
              "cartItems.$": {
                ...cartItem,
                quantity: availableItem.quantity + cartItem.quantity,
              },
            },
          };
        } else {
          condition = { user: req.user._id };
          update = {
            $push: {
              cartItems: cartItem,
            },
          };
        }
        updatedCart = await Cart.findOneAndUpdate(condition, update, {
          new: true,
        });
        // console.log(updatedCart);
        //  updatedCart =  promiseArray.push(_cart);
        res.status(201).json({ updatedCart });
      });
      // console.log(promiseArray);
      // const response = Promise.all(promiseArray);
      // console.log(response);
    } else {
      const newCart = await Cart.create({
        user: req.user._id,
        cartItems: req.body.cartItems,
      });
      res.status(201).json(newCart);
    }
  } catch (error) {
    throw new Error(error);
  }
});
//@desc     Get all cart items
//@route    POST/api/user/cart/getCart
//@access   User
const getCartItems = asyncHandler(async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "cartItems.product",
      "_id name price productPictures"
    );
    if (cart) {
      let cartItems = {};
      cart.cartItems.forEach((item) => {
        cartItems[item.product._id.toString()] = {
          _id: item.product._id.toString(),
          name: item.product.name,
          img: item.product.productPictures[0].img,
          price: item.product.price,
          qty: item.quantity,
        };
      });
      res.status(200).json({ cartItems });
    }
  } catch (error) {
    throw new Error(error);
  }
});
//@desc     Remove an item from Cart
//@route    POST/api/user/cart/removeItem
//@access   User
const removeCartItems = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.body.payload;
    if (productId) {
      const updatedCart = await Cart.updateOne(
        { user: req.user._id },
        {
          $pull: {
            cartItems: {
              product: productId,
            },
          },
        }
      );
      res.status(202).json({ updatedCart });
    }
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  addItemToCart,
  getCartItems,
  removeCartItems,
};
