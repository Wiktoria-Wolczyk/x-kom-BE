import "dotenv/config";
import * as express from "express";
import { AppDataSource } from "./database/data-source";
import { User } from "./entity/User";

const app = express();
const port = 3000;

interface IBody {
  firstName: string;
  lastName: string;
  email: string;
}

AppDataSource.initialize()
  .then(() => console.log("Data Source has been initialized!"))
  .catch((err) =>
    console.error("Error during Data Source initialization:", err)
  );

app.use(express.json());

const usersRepository = AppDataSource.getRepository(User);

app.get("/users", async (request, response) => {
  const [users, count] = await usersRepository.findAndCount();

  response.status(200).json({
    status: "Success",
    message: {
      users,
      count,
    },
  });
});

app.get("/users/:id", async (request, response) => {
  const id = request.params.id;
  const userID = +id;
  // const user = await usersRepository.findOneBy({ id: userID });
  const user = await usersRepository
    .createQueryBuilder("user")
    .where("user.id = :id", { id: userID })
    .getOne();

  response.status(200).json({
    status: "user by id",
    message: user,
  });
});

app.post("/users", async (request, response) => {
  let body = request.body;
  let newUser: IBody = new User();

  newUser.firstName = body.firstName;
  newUser.lastName = body.lastName;
  newUser.email = body.email;

  const addedUser = await AppDataSource.manager.save(newUser);

  response.status(201).json({
    status: "created",
    message: addedUser,
  });
});

app.delete("/users/:id", async (request, response) => {
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

app.put("/users/:id", async (request, response) => {
  const body = request.body;

  const id = request.params.id;
  const userID = +id;

  let userToUpdate = await usersRepository.findOneBy({ id: userID });

  userToUpdate = {
    ...userToUpdate,
    ...body,
    id: userID,
  };

  const updatedUser = await usersRepository.save(userToUpdate);

  response.status(200).json({
    status: "user updated",
    message: updatedUser,
  });
});

app.listen(port, () => {
  console.log(`Shop backend is listening on port: ${port}`);
});
