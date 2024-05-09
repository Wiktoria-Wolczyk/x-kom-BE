import * as express from "express";
const router = express.Router();
import { AppDataSource } from "../database/data-source";
import { Order } from "../entity/Order";
import { User } from "../entity/User";
import { Product } from "../entity/Product";
import * as jwt from "jsonwebtoken";
import { tokenVerification } from "../middlewares/authMiddleware";

const ordersRepository = AppDataSource.getRepository(Order);
const usersRepository = AppDataSource.getRepository(User);

router.post("/", async (request, response) => {
  const body = request.body;
  const { userID, productsID: productsIDArray } = body;

  let newOrder = new Order();

  const assignedUser = await usersRepository.findOneBy({ id: userID });
  const arrayOfProducts = productsIDArray.map((el) => ({ id: el }));

  newOrder.createDate = body.createDate;
  newOrder.updateDate = body.updateDate;
  newOrder.couponCode = body.couponCode;
  newOrder.status = body.status;
  newOrder.user = assignedUser;
  newOrder.products = arrayOfProducts;

  const addedOrder = await AppDataSource.manager.save(newOrder);

  response.status(201).json({
    status: "created",
    message: addedOrder,
  });
});

router.use((request, response, next) => {
  tokenVerification(request, response, next);
});

router.get("/", async (request, response) => {
  const [orders, count] = await ordersRepository.findAndCount();

  response.status(200).json({
    status: "Success",
    message: {
      orders,
      count,
    },
  });
});

router.get("/:id", async (request, response) => {
  const orderID = +request.params.id;

  const order = await ordersRepository.find({
    where: { id: orderID },
    relations: { user: true, products: true },
  });

  // const order = await ordersRepository
  //   .createQueryBuilder("order")
  //   .where("order.id = :id", { id: orderID })
  //   .leftJoinAndSelect("order.user", "user")
  //   .getOne();

  response.status(200).json({
    status: "success",
    message: order,
  });
});

router.delete("/:id", async (request, response) => {
  const orderID = +request.params.id;

  const deletedOrder = await ordersRepository.delete(orderID);

  response.status(200).json({
    status: "success",
    message: deletedOrder,
  });
});

router.put("/:id", async (request, response) => {
  const { userID, productsIDs, ...rest } = request.body;
  const orderID = +request.params.id;
  const arrayOfProducts = productsIDs.map((el) => ({ id: el }));

  let orderToUpdate = await ordersRepository.findOneBy({ id: orderID });

  orderToUpdate = {
    ...orderToUpdate,
    ...rest,
    id: orderID,
    user: { id: userID },
    products: arrayOfProducts,
  };

  const updatedOrder = await ordersRepository.save(orderToUpdate);

  response.status(200).json({
    status: "order updated",
    message: updatedOrder,
  });
});

export default router;
