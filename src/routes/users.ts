import * as express from "express";
const router = express.Router();
import { AppDataSource } from "../database/data-source";
import { User } from "../entity/User";
import { hashSync } from "bcrypt";

const usersRepository = AppDataSource.getRepository(User);

router.get("/", async (request, response) => {
  const [users, count] = await usersRepository.findAndCount();

  response.status(200).json({
    status: "Success",
    message: {
      users,
      count,
    },
  });
});

router.get("/:id", async (request, response) => {
  const id = request.params.id;
  const userID = +id;
  const user = await usersRepository
    .createQueryBuilder("user")
    .where("user.id = :id", { id: userID })
    .getOne();

  response.status(200).json({
    status: "user by id",
    message: user,
  });
});

router.post("/", async (request, response) => {
  const body = request.body;
  console.log("body", body);
  const newUser = new User();

  newUser.firstName = body.firstName;
  newUser.lastName = body.lastName;
  newUser.email = body.email;
  newUser.password = body.password;

  console.log("newpassword", newUser.password);

  const addedUser = await AppDataSource.manager.save(newUser);

  response.status(201).json({
    status: "created",
    message: addedUser,
  });
});

router.delete("/:id", async (request, response) => {
  const id = request.params.id;
  const userID = +id;

  const usersRepository = AppDataSource.getRepository(User);
  const userToRemove = await usersRepository.findOneBy({ id: userID });

  const deletedUser = await usersRepository.remove(userToRemove);

  response.status(200).json({
    status: "success",
    message: deletedUser,
  });
});

router.put("/:id", async (request, response) => {
  const body = request.body;
  console.log("body", body);
  const id = request.params.id;
  const userID = +id;

  let userToUpdate = await usersRepository.findOneBy({ id: userID });

  delete body.password;
  delete body.id;

  userToUpdate = {
    ...userToUpdate,
    ...body,
  };

  const updatedUser = await usersRepository.save(userToUpdate);

  response.status(200).json({
    status: "user updated",
    message: updatedUser,
  });
});

router.put("/:id/password", async (request, response) => {
  const body = request.body;
  console.log("body z password", body);
  const id = request.params.id;
  const userID = +id;

  const userToUpdate = await usersRepository.findOneBy({ id: userID });
  console.log("dddd", userToUpdate);

  const hashedPassword = hashSync(body.password, 10);
  console.log("hashedPas", hashedPassword);
  userToUpdate.password = hashedPassword;

  const updatedUser = await usersRepository.save(userToUpdate);

  response.status(200).json({
    status: "user updated",
    message: updatedUser,
  });
});

export default router;
