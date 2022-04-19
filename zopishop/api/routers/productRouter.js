import express from "express";
import expressAsyncHandler from "express-async-handler";
import Product from "../models/productModel.js";
import { isAuth, isSellerOrAdmin } from "../utils.js";

const productRouter = express.Router();

productRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    const qNew = req.query.new;
  const qCategory = req.query.category;
  try {
    let products;

    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(1);
    } else if (qCategory) {
      products = await Product.find({
        categories: {
          $in: [qCategory],
        },
      });
    } else {
      products = await Product.find();
    }

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
  })
);

productRouter.get(
  "/find/:id", 
  expressAsyncHandler(async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      res.status(200).json(product);
    } catch (err) {
      res.status(500).json(err);
    }
  })
);

// productRouter.get(
//   "/seed",
//   expressAsyncHandler(async (req, res) => {
//     await Product.remove({});
//     const createdProducts = await Products.insertMany(data.products);
//     res.send({ createdProducts });
//   })
// );

productRouter.post(
  "/",
  expressAsyncHandler(async (req, res) => {
      const product = new Product(req.body);
      try {
        const products = await product.save();
        res.status(201).send(products);
      } catch (err) {
        res.status(401).send(err);
      }
    })
  );

productRouter.put(
  "/:id",
  isAuth,
  isSellerOrAdmin,
  expressAsyncHandler(async (req, res) => {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedProduct);
    } catch (err) {
      res.status(500).json(err);
    }
  })
);

productRouter.delete(
  "/:id",
  isAuth,
  isSellerOrAdmin,
  expressAsyncHandler(async (req, res) => {
    try {
      await Product.findByIdAndDelete(req.params.id);
      res.status(200).json("Product has been deleted...");
    } catch (err) {
      res.status(500).json(err);
    }
  })
);

export default productRouter;
