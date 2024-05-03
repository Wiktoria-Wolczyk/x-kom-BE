import "dotenv/config";
import * as express from "express";
import { AppDataSource } from "./database/data-source";
import { User } from "./entity/User";
import users from "./routes/users";
import products from "./routes/products";
import orders from "./routes/orders";
import auth from "../src/authorization/auth";

const app = express();
const port = 3000;

AppDataSource.initialize()
  .then(() => console.log("Data Source has been initialized!"))
  .catch((err) =>
    console.error("Error during Data Source initialization:", err)
  );

app.use(express.json());
app.use("/users", users);
app.use("/products", products);
app.use("/orders", orders);
app.use("/auth", auth);

app.listen(port, () => {
  console.log(`Shop backend is listening on port: ${port}`);
});
