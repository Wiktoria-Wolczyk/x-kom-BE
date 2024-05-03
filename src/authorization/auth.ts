import * as express from "express";
const router = express.Router();
import { User } from "../entity/User";
import { AppDataSource } from "../database/data-source";

const usersRepository = AppDataSource.getRepository(User);

// router.post("/login", async (request, response) => {});

// router.post("/register", async (request, response) => {
//   let body = request.body;
//   let newUser = new User();

//   newUser.firstName = body.firstName;
//   newUser.lastName = body.lastName;
//   newUser.email = body.email;

//   const addedUser = await usersRepository.save(newUser);

//   response.status(201).json({
//     status: "created",
//     message: addedUser,
//   });
// });

router.post("/forgot-password", async (request, response) => {
  const email = request.body;
  console.log("body", email);

  const userMailToFind = await usersRepository.findOneBy(email);
  console.log("userMailToFind", userMailToFind);

  if (userMailToFind) {
    response.status(200).json({
      status: "user exist",
      message: "/new-password",
    });
  } else {
    response.status(404).json({
      status: "not found user",
      message: "user don't exist",
    });
  }

  // tu chce mieć tego przekazanego maila
  // weryfikacja czy mail istnieje w usersach
  // wysylam link dla użytkownika do zmiany hasła
});

router.put("/new-password", async (request, response) => {
  const { newPassword, confirmPassword } = request.body;
  console.log("confirmPassword", request.body.confirmPassword);

  if (
    newPassword === confirmPassword &&
    newPassword.length !== 0 &&
    confirmPassword.length !== 0
  ) {
    response.status(200).json({
      status: "success",
      message: "password is set",
    });
  } else {
    response.status(204);
  }

  //3 elsy jak nie pasuje haslo, jak jest puste haslo, jak jest puste confirm
  //musze sprawdzic czy newPassword === confirmPassword
  //trzeba przypisac do użytkownika
});

export default router;
