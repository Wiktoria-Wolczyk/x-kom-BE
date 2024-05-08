import * as express from "express";
import { hashSync, compare, hash, compareSync } from "bcrypt";
const router = express.Router();
import { User } from "../entity/User";
import { AppDataSource } from "../database/data-source";
import * as jwt from "jsonwebtoken";

const usersRepository = AppDataSource.getRepository(User);

router.post("/login", async (request, response) => {
  const { email, password } = request.body;
  const findUser = await usersRepository.findOneBy({ email });

  const comparePassword = compareSync(password, findUser.password);
  if (!comparePassword) {
    response.status(404).json({
      status: "failed",
      message: "authorization failed",
    });
  }

  const token = jwt.sign(JSON.stringify(findUser), process.env.JWT_SECRET);

  response.status(200).json({
    status: "success",
    message: token,
  });

  // 1. pobieram body
  // 2. pobierasz usera po emailu z bazy - find user po mailu
  // 3. porownuje wpisane haslo z zahashowanym - user.password
  // 4.1. jesli sie zgadza -> zaloguj, czyli zwroc 'true'
  // 4.2. jesli sie NIE zgadza -> zwroc 'false'
});

router.post("/register", async (request, response) => {
  let body = request.body;
  let newUser = new User();
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
    let user = await usersRepository.findOneBy({ id: userID });
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
