import * as express from "express";
const router = express.Router();
import * as fs from "fs";
import * as multer from "multer";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = file.originalname.split(".")[1];

    cb(null, file.fieldname + "-" + uniqueSuffix + `.${ext}`);
  },
});

const upload = multer({ storage: storage });

// const upload = multer({ dest: "uploads/" });

import { AppDataSource } from "../database/data-source";
import { User } from "../entity/User";
import { Request } from "express";

// router.post("/", (request, response) => {
// const fileFilterConfig = function (req, file, cb) {
//   if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
//     // calling callback with true
//     // as mimetype of file is image
//     cb(null, true);
//   } else {
//     // false to indicate not to store the file
//     cb(null, false);
//   }
// };

const usersRepository = AppDataSource.getRepository(User);

router.post(
  "/fs/upload",
  upload.single("avatar"),
  async (request: Request, response) => {
    console.log("1", request.file);
    console.log(2, request.body);
    console.log("dd", request.body.userID);

    const userID = request.body.userID;
    const path = request.file.path;
    console.log("path", path);

    let userToUpdate = await usersRepository.findOneBy({ id: userID });

    userToUpdate = {
      ...userToUpdate,

      avatar: path,
    };

    const updatedUser = await usersRepository.save(userToUpdate);
    console.log("updated user", updatedUser);

    return response.status(200).json({
      status: "success",
      message: updatedUser,
    });
  },
);

// });

router.get("/copy", (request, response) => {
  let res = "";

  console.log(1);
  res = fs.readFileSync("src/routes/start.txt", {
    encoding: "utf8",
    flag: "r",
  });

  // if (err) {
  //   return console.error(err);
  // }
  // res = data.toString();
  // console.log(2);
  fs.writeFileSync("src/routes/end.txt", res);

  console.log(3);
  response.status(200).json({
    status: "success",
    message: `The following text: ${res} has been saved to another file. `,
  });
});

router.post("/fs/saveFromReq", (request, response) => {
  const body = request.body;
  console.log("body", body);

  const bodyName = body.name;
  console.log("bodyName", bodyName);

  if (fs.existsSync("src/routes/inputData.txt")) {
    fs.appendFileSync("src/routes/inputData.txt", `\n${bodyName}`, "utf8");
  } else {
    fs.writeFileSync(`src/routes/inputData.txt`, bodyName);
  }

  response.status(200).json({
    status: "success",
    message: "jakis message",
  });
});

export default router;
