import "dotenv/config";
import express from "express";
import cors from "cors";
import compress from "compression";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import models, { sequelize } from "./models/indexModels";
import routes from "./routes/indexRoute";

// declare port
const port = process.env.PORT || 1337;

const app = express();
// parse body params and attach them to req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// user helmet untuk SEO
app.use(helmet());
// secure apps by setting various HTTP headers
app.use(compress());
// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// load models dan simpan di req.context
app.use(async (req, res, next) => {
  req.context = { models };
  next();
});

app.use(process.env.URL_DOMAIN, (req, res) => {
  res.send("Welcome to E-Shopay");
})

app.use(process.env.URL_API + "/categories", routes.categoryRoute);
app.use(process.env.URL_API + "/users", routes.userRoute);
app.use(process.env.URL_API + "/products", routes.productRoute);
app.use(process.env.URL_API + "/carts", routes.cartRoute);
app.use(process.env.URL_API + "/line-items", routes.lineItemRoute);
app.use(process.env.URL_API + "/orders", routes.orderRoute);

const dropDatabaseSync = false;
sequelize.sync({ force: dropDatabaseSync })
  .then(async () => {
    if (dropDatabaseSync) {
      console.log("Database do not drop");
    }
    app.listen(port, () => console.log(`Server Running on Port ${port}`));
  });

export default app;