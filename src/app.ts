import * as express from "express";
import { AppDataSource } from "./data-source";
import { User } from "./entity/User";
import { faGenderless } from "@fortawesome/free-solid-svg-icons";
import * as bodyParser from "body-parser";

const app = express();
const port = 3000;

interface IBody {
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  city: string;
  country: string;
}

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });

app.use(bodyParser.json());

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
  const user = await usersRepository.findOneBy({ id: userID });

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
  newUser.age = body.age;
  newUser.gender = body.gender;
  newUser.city = body.city;
  newUser.country = body.country;

  // console.log("body", body);
  // apka nie rozumie body. robilismy to pare razy
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
    status: "deleted",
    message: deletedUser,
  });
});

app.put("/users/:id", async (request, response) => {
  const body = request.body;

  const id = request.params.id;
  const idToNumber = Number(id);

  const userID = idToNumber;
  console.log({ userID });

  let userToUpdate = await usersRepository.findOneBy({ id: userID });

  userToUpdate = {
    ...body,
    id: userID,
  };

  console.log({ userToUpdate });
  let updatedUsersRepository = await usersRepository.save(userToUpdate);

  response.status(200).json({
    status: "user updated",
    message: updatedUsersRepository,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
