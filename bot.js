require("dotenv").config();

const express = require("express");
const { Bot } = require("grammy");

const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const {
  verifyCommand,
  verifyRoute,
  verifyPost,
} = require("./modules/worldid.js");

const tg = new Bot(process.env.BOT_TOKEN);
exports.tg = tg;

// WorldCoin

tg.command("verify", verifyCommand);

app.get("/verify/:userId", verifyRoute);
app.post("/verify", verifyPost);

// WorldCoin

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

tg.start();
