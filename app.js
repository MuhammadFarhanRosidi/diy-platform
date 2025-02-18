require("dotenv").config();

const express = require("express");
const app = express();
const port = process.env.NEXT_PUBLIC_BASE_URL || 3000;
const router = require("./routes/index");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use("/", router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
