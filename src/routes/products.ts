import * as express from "express";
const router = express.Router();
import { AppDataSource } from "../database/data-source";
import { Product } from "../entity/Product";
import { request } from "http";
import * as jwt from "jsonwebtoken";
import { tokenVerification } from "../middlewares/authMiddleware";
import { Like } from "typeorm";

const productsRepository = AppDataSource.getRepository(Product);

router.get("/", async (request, response) => {
  const [products, count] = await productsRepository.findAndCount();

  response.status(200).json({
    status: "Success",
    message: {
      products,
      count,
    },
  });
});

router.get("/:id", async (request, response) => {
  const id = request.params.id;
  const productID = +id;
  const product = await productsRepository
    .createQueryBuilder("user")
    .where("product.id = :id", { id: productID })
    .getOne();

  response.status(200).json({
    status: "success",
    message: product,
  });
});

router.post("/", async (request, response) => {
  let body = request.body;
  let newProduct = new Product();

  newProduct.name = body.name;
  newProduct.price = body.price;
  newProduct.discountedPrice = body.discountedPrice;
  newProduct.available = body.available;
  newProduct.category = body.category;
  newProduct.brand = body.brand;

  const addedProduct = await AppDataSource.manager.save(newProduct);

  response.status(201).json({
    status: "created",
    message: addedProduct,
  });
});

router.delete(
  "/:id",
  (request, response, next) => {
    tokenVerification(request, response, next);
  },
  async (request, response) => {
    const id = request.params.id;
    const productID = +id;

    const productsRepository = AppDataSource.getRepository(Product);
    const deletedProduct = await productsRepository.delete(productID);

    response.status(200).json({
      status: "success",
      message: deletedProduct,
    });
  }
);

router.put("/:id", async (request, response) => {
  const body = request.body;

  const id = request.params.id;
  const productID = +id;

  let productToUpdate = await productsRepository.findOneBy({ id: productID });

  productToUpdate = {
    ...productToUpdate,
    ...body,
    id: productID,
  };

  const updatedProduct = await productsRepository.save(productToUpdate);

  response.status(200).json({
    status: "product updated",
    message: updatedProduct,
  });
});

router.get("/page/:page/limit/:limit", async (request, response) => {
  const page = +request.params.page;
  const limit = +request.params.limit;

  if (page < 0 || limit < 0) {
    return response.status(400).json({
      status: "failed",
      message: "Invalid input§",
    });
  }

  const [products, count] = await productsRepository
    .createQueryBuilder("product")
    .skip(limit * (page - 1))
    .take(limit)
    .getManyAndCount();

  response.status(200).json({
    status: "success",
    message: {
      data: products,
      count: count,
    },
  });
});

router.post("/search/page/:page/limit/:limit", async (request, response) => {
  const page = +request.params.page;
  const limit = +request.params.limit;
  const searchText = request.body.searchText;

  if (page < 0 || limit < 0) {
    return response.status(400).json({
      status: "failed",
      message: "Invalid input",
    });
  }

  const [products, count] = await productsRepository
    .createQueryBuilder("product")
    .where({ name: Like(`%${searchText}%`) })
    .skip(limit * (page - 1))
    .take(limit)
    .getManyAndCount();

  response.status(200).json({
    status: "success",
    message: {
      data: products,
      count: count,
    },
  });
});

export default router;
