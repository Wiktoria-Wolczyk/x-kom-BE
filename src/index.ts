// import { AppDataSource } from "./data-source";
// import { User } from "./entity/User";

// AppDataSource.initialize()
//   .then(async () => {
//     console.log("Connected to DB");
//     const usersRepository = AppDataSource.getRepository(User);

//     const _user = new User();
//     _user.firstName = "Wiktoria2";
//     _user.lastName = "Wolczyk2";
//     _user.age = 24;
//     _user.city = "Bielsko";
//     _user.gender = "woman";
//     _user.country = "Cebulandia";

//     const response = await usersRepository.save(_user);
//     console.log({ response });
//     // const users = await AppDataSource.manager.find(User);
//     // console.log("Loaded users: ", users);
//   })
//   .catch((error) => console.log(error));
