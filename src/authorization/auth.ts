import * as express from "express";
import { hashSync, compareSync } from "bcrypt";
const router = express.Router();
import { User } from "../entity/User";
import { AppDataSource } from "../database/data-source";
import * as jwt from "jsonwebtoken";

const usersRepository = AppDataSource.getRepository(User);

router.post("/login", async (request, response) => {
  const { email, password } = request.body;
  console.log("1", request.body);
  const findUser = await usersRepository.findOneBy({ email });

  if (!findUser) {
    return response.status(404).json({
      status: "failed",
      message: "authorization failed",
    });
  }

  console.log("2", findUser);

  const comparePassword = compareSync(password, findUser.password);
  if (!comparePassword) {
    response.status(404).json({
      status: "failed",
      message: "authorization failed",
    });
  } else {
    const token = jwt.sign(
      JSON.parse(JSON.stringify(findUser)),
      process.env.JWT_SECRET,
      {
        expiresIn: "10h",
      },
    );

    delete findUser.password;

    console.log("userInREsponse", findUser);

    response.status(200).json({
      status: "success",
      message: { token, user: findUser },
    });
  }
});

router.post("/register", async (request, response) => {
  const body = request.body;
  const newUser = new User();
  const pass = body.password;

  const hashedPassword = hashSync(pass, 10); //cos z tym pass i bcryptem

  newUser.firstName = body.firstName;
  newUser.lastName = body.lastName;
  newUser.email = body.email;
  newUser.password = hashedPassword;

  console.log("hashedPassword", hashedPassword);

  const addedUser = await usersRepository.save(newUser);

  response.status(201).json({
    status: "success",
    message: addedUser,
  });
});

router.post("/forgot-password", async (request, response) => {
  const email = request.body;

  const userMailToFind = await usersRepository.findOneBy(email);
  console.log("userMailToFind", userMailToFind);

  if (userMailToFind) {
    response.status(200).json({
      status: "success",
      message: "/new-password",
    });
  } else {
    response.status(404).json({
      status: "failed",
      message: "user don't exist",
    });
  }

  // tu chce mieć tego przekazanego maila
  // weryfikacja czy mail istnieje w usersach
  // wysylam link dla użytkownika do zmiany hasła
});

router.put("/new-password/:id?", async (request, response) => {
  const body = request.body;
  const { newPassword, confirmPassword } = body;
  const id = request.query.id;
  const userID = +id;

  if (
    !newPassword ||
    !confirmPassword ||
    newPassword.length === 0 ||
    confirmPassword.length === 0
  ) {
    response.status(400).json({
      status: "failed",
      message: "password cannot be empty",
    });
  }

  if (newPassword === confirmPassword) {
    const user = await usersRepository.findOneBy({ id: userID });
    const hashedPassword = hashSync(newPassword, 10);
    user.password = hashedPassword;

    await usersRepository.save(user);

    response.status(200).json({
      status: "success",
      message: "password is set",
    });
  } else {
    response.status(400).json({
      status: "failed",
      message: "password and confirmPassword are not correct",
    });
  }
});

export default router;
