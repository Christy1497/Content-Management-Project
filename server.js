const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const authRouter = require("./controllers/auth");
const contentRouter = require("./controllers/content");
const authMiddleware = require("./middleware/auth");
const  checkUserRole = require("./middleware/roles");

dotenv.config();

const app = express();
app.use(express.json());

const router = express.Router();

const url = process.env.MONGODB_URL;
//console.log(url);

try {
  mongoose.connect(url);
} catch (error) {
  console.error("mongodb connection error: ", error);
}

const port = process.env.PORT;

router.use("/auth", authRouter);
 router.use("/content", authMiddleware, contentRouter);
 router.use("/content", checkUserRole(["admin"]), contentRouter);


router.get("/", (req, res) => {
  res.send({ message: "CMS API RUNNING HERE" });
});

app.use(router);

app.use("*", (req, res) => {
  res.status(404).json({ error: "this route does not exist" });
});


app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});