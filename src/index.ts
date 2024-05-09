import "dotenv/config";
import * as express from "express";
import { AppDataSource } from "./database/data-source";
import { User } from "./entity/User";
import users from "./routes/users";
import products from "./routes/products";
import orders from "./routes/orders";
import auth from "../src/authorization/auth";
import * as jwt from "jsonwebtoken";

const app = express();
const port = 3000;

AppDataSource.initialize()
  .then(() => console.log("Data Source has been initialized!"))
  .catch((err) =>
    console.error("Error during Data Source initialization:", err)
  );

app.use((request, response, next) => {
  try {
    const authorizationString = request.headers.authorization; // z Bearerem
    const token = authorizationString.split(" ")[1];

    const verification = jwt.verify(token, process.env.JWT_SECRET);

    if (verification) {
      next();
    }
  } catch (error) {
    console.error(error);
    response.status(404).json({
      status: "failed",
      message: "authorization failed",
    });
  }
});

app.use(express.json());
app.use("/users", users);
app.use("/products", products);
app.use("/orders", orders);
app.use("/auth", auth);

app.listen(port, () => {
  console.log(`Shop backend is listening on port: ${port}`);
});
