const express = require("express");
const fetch = require("node-fetch");
const dotenv = require("dotenv").config();
const cors = require("cors")

const port = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());
const igdbRouter = require("./routes/igdb");
app.use("/api/v1/igdb", igdbRouter);

app.listen(port, () => console.log(`Server started on port ${port}`));
