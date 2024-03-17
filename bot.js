require("dotenv").config();

const express = require("express");
const { Bot } = require("grammy");
const { InlineKeyboard } = require("grammy");
const { config } = require("./config.js");
const path = require("path");
const cors = require("cors");

const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const {
  verifyCommand,
  verifyRoute,
  verifyPost,
} = require("./modules/worldid.js");
const {
  dynamicVerifyCommand,
  dynamicVerifyPost,
} = require("./modules/dynamicVerify.js");

const tg = new Bot(process.env.BOT_TOKEN);
exports.tg = tg;

// WorldCoin

tg.command("start", verifyCommand);

app.get("/verify/:userId", verifyRoute);
app.post("/verify", verifyPost);

//

tg.command("dynamic_verify", dynamicVerifyCommand);
app.post("/dynamic_verify", dynamicVerifyPost);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

tg.start();
