import express from "express";
import expressAsyncHandler from "express-async-handler";
import Cart from "../models/cartModel.js";
import { isAuth } from "../utils.js";

const cartRouter = express.Router();

// // Get all post
cartRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    try {
      const carts = await Cart.find();
      res.status(200).json(carts);
    } catch (err) {
      res.status(500).json(err);
    }
  })
);


// Get blog
cartRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    try {
      const cart = await Cart.findOne({ userId: req.params.userId });
      res.status(200).json(cart);
    } catch (err) {
      res.status(500).json(err);
    }
  })
);

// CREATE POST
cartRouter.post(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const newCart = new Cart(req.body);
    try {
      const savedCart = await newCart.save();
      res.status(200).json(savedCart);
    } catch (err) {
      res.status(500).json(err);
    }
  })
);

// Update post
cartRouter.put(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const updatedCart = await Cart.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedCart);
    } catch (err) {
      res.status(500).json(err);
    }
  })
);

// delete post
cartRouter.delete(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    try {
      await Cart.findByIdAndDelete(req.params.id);
      res.status(200).json("Cart has been deleted...");
    } catch (err) {
      res.status(500).json(err);
    }
  })
);

export default cartRouter;
