const express = require("express");
const router = express.Router();
const ProductsService = require("../../services/products");

const productsService = new ProductsService();

router.get("/", async function (req, res, next) {
  const { tags } = req.query;

  try {
    const products = await productsService.getProducts({ tags })
  
    res.status(200).json({
      data: products,
      message: "product listed",
    });
  } catch (error) {
    next(error)
  }
});

router.get("/:productId", async function (req, res) {
  const { productId } = req.params;

  try {
    const product = await productsService.getProduct({ productId })

    res.status(200).json({
      data: product,
      message: "product retrieved",
    });
  } catch (error) {
    next(error)
  }
});

router.post("/", function (req, res) {
  const { body: product } = req;

  try {
    const createdProduct = productsService.createProduct({ product })

    res.status(201).json({
      data: createdProduct,
      message: "product created",
    });
  } catch (error) {
    next(error)
  }
});

router.put("/:productId", async function (req, res) {
  const { productId } = req.params;
  const { body: product } = req;
  
  try {
    const updateProduct = await productsService.updateProduct({ productId, product })

    res.status(200).json({
      data: updateProduct,
      message: "product updated",
    });
  } catch (error) {
    next(error)
  }
});

router.delete("/:productId", async function (req, res) {
  const { productId } = req.params;

  try {
    const product = await productsService.deleteProduct({ productId })
    
    res.status(200).json({
      data: product,
      message: "product deleted",
    });
  } catch (error) {
    next(error)
  }
});

module.exports = router;
