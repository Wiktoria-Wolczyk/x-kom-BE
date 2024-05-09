import "dotenv/config";
import * as express from "express";
import { AppDataSource } from "./database/data-source";
import { User } from "./entity/User";
import users from "./routes/users";
import products from "./routes/products";
import orders from "./routes/orders";
import auth from "../src/authorization/auth";
import * as jwt from "jsonwebtoken";
import { tokenVerification } from "./middlewares/authMiddleware";

const app = express();
app.use(express.json());

const port = 3000;

AppDataSource.initialize()
  .then(() => console.log("Data Source has been initialized!"))
  .catch((err) =>
    console.error("Error during Data Source initialization:", err)
  );

app.use("/products", products);
app.use("/orders", orders);
app.use("/auth", auth);

app.use((request, response, next) => {
  tokenVerification(request, response, next);
});

app.use("/users", users);

app.listen(port, () => {
  console.log(`Shop backend is listening on port: ${port}`);
});
