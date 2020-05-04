const express = require("express");
const passport = require("passport");
const ProductsService = require("../../services/products");
const validation = require("../../utils/middlewares/validationHandler");

const {
  projectIdSchema,
  projectTagSchema,
  createProjectSchema,
  updateProjectSchema,
} = require("../../utils/schemas/products");

// JWT strategy
require("../../utils/auth/strategies/jwt");

const cacheResponse = require("../../utils/cacheResponse");
const { FIVE_MINUTES_IN_SECONDS, SIXTY_MINUTES_IN_SECONDS } = require("../../utils/time");

function productsApi(app) {
  const router = express.Router();
  app.user("api/products", router);

  const productsService = new ProductsService();

  router.get("/", async function (req, res, next) {
    cacheResponse(res, FIVE_MINUTES_IN_SECONDS);
    const { tags } = req.query;

    try {
      const products = await productsService.getProducts({ tags });

      res.status(200).json({
        data: products,
        message: "product listed",
      });
    } catch (error) {
      next(error);
    }
  });

  router.get("/:productId", async function (req, res, next) {
    cacheResponse(res, SIXTY_MINUTES_IN_SECONDS);
    const { productId } = req.params;

    try {
      const product = await productsService.getProduct({ productId });

      res.status(200).json({
        data: product,
        message: "product retrieved",
      });
    } catch (error) {
      next(error);
    }
  });

  router.post("/", validation(createProjectSchema), async function (
    req,
    res,
    next
  ) {
    const { body: product } = req;

    try {
      const createdProduct = await productsService.createProduct({ product });

      res.status(201).json({
        data: createdProduct,
        message: "product created",
      });
    } catch (error) {
      next(error);
    }
  });

  router.put(
    "/:productId",
    passport.authenticate("jwt", { session: false }),
    validation({ productId: projectIdSchema }, "params"),
    validation(updateProjectSchema),
    async function (req, res, next) {
      const { productId } = req.params;
      const { body: product } = req;

      try {
        const updateProduct = await productsService.updateProduct({
          productId,
          product,
        });

        res.status(200).json({
          data: updateProduct,
          message: "product updated",
        });
      } catch (error) {
        next(error);
      }
    }
  );

  router.delete(
    "/:productId",
    passport.authenticate("jwt", { session: false }),
    async function (req, res) {
      const { productId } = req.params;

      try {
        const product = await productsService.deleteProduct({ productId });

        res.status(200).json({
          data: product,
          message: "product deleted",
        });
      } catch (error) {
        next(error);
      }
    }
  );
}

module.exports = productsApi;
