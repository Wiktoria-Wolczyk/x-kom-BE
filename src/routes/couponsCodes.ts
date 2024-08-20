import * as express from "express";
const router = express.Router();
import { AppDataSource } from "../database/data-source";
import { CouponCode } from "../entity/CouponCode";

const couponRepository = AppDataSource.getRepository(CouponCode);

router.post("/", async (request, response) => {
  const body = request.body;

  const newCouponCode = new CouponCode();

  newCouponCode.createDate = body.createDate;
  newCouponCode.updateDate = body.updateDate;
  newCouponCode.startDate = body.startDate;
  newCouponCode.endDate = body.endDate;
  newCouponCode.value = body.value;
  newCouponCode.percentageValue = body.percentageValue;
  newCouponCode.code = body.code;
  newCouponCode.name = body.name;

  const addedCouponCode = await AppDataSource.manager.save(newCouponCode);

  console.log("aaaadddee", addedCouponCode);

  response.status(200).json({
    status: "success",
    message: addedCouponCode,
  });
});

router.get("/", async (request, response) => {
  const [coupons, count] = await couponRepository.findAndCount();

  response.status(200).json({
    status: "success",
    message: {
      coupons,
      count,
    },
  });
});

router.get("/:id", async (request, response) => {
  const couponID = +request.params.id;

  const findCoupon = await couponRepository.findOneBy({ id: couponID });

  response.status(200).json({
    status: "success",
    message: findCoupon,
  });
});

router.put("/:id", async (request, response) => {
  const couponID = +request.params.id;

  let couponToUpdate = await couponRepository.findOneBy({ id: couponID });

  const body = request.body;

  couponToUpdate = {
    ...couponToUpdate,
    ...body,
    id: couponID,
  };

  const updatedCoupon = await couponRepository.save(couponToUpdate);

  response.status(200).json({
    status: "success",
    message: updatedCoupon,
  });
});

router.delete("/:id", async (request, response) => {
  const couponID = +request.params.id;

  const couponToDelete = await couponRepository.delete(couponID);

  response.status(200).json({
    status: "success",
    message: couponToDelete,
  });
});

export default router;
