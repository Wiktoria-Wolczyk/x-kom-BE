import "dotenv/config";
import * as express from "express";
import { AppDataSource } from "./database/data-source";
import users from "./routes/users";
import products from "./routes/products";
import orders from "./routes/orders";
import auth from "../src/authorization/auth";
import couponsCodes from "../src/routes/couponsCodes";
import * as cors from "cors";
import files from "./routes/files";

const app = express();
app.use(express.json());
app.use(cors());

console.log(__dirname);
const port = 3000;

AppDataSource.initialize()
  .then(() => console.log("Data Source has been initialized!"))
  .catch((err) =>
    console.error("Error during Data Source initialization:", err),
  );

app.use("/uploads", express.static(__dirname + "/../uploads"));

app.use("/files", files);
app.use("/auth", auth);
app.use("/products", products);
app.use("/coupons", couponsCodes);

// app.use((request, response, next) => {
//   tokenVerification(request, response, next);
// });

app.use("/orders", orders);
app.use("/users", users);

app.listen(port, () => {
  console.log(`Shop backend is listening on port: ${port}`);
});
