import "dotenv/config";
import express from "express";
import cors from "cors";
import compress from "compression";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import models, { sequelize } from "./models/indexModels";
import routes from "./routes/indexRoute";

const port = process.env.PORT || 1337;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(helmet());

app.use(compress());

app.use(cors());

app.use(async (req, res, next) => {
  req.context = { models };
  next();
});

app.use("/e-shopay", (req, res) => {
  res.send("Welcome to E-Shopay");
})

app.use("/categories", routes.categoryRoute);
app.use("/users", routes.userRoute);

const dropDatabaseSync = false;
sequelize.sync({ force: dropDatabaseSync })
  .then(async () => {
    if (dropDatabaseSync) {
      console.log("Database do not drop");
    }
    app.listen(port, () => console.log(`Server Running on Port ${port}`));
  });

export default app;