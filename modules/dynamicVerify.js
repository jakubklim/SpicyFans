// modules/dynamic/verifyPost

const { InlineKeyboard } = require("grammy");
const bot = require("../bot.js");
const { config } = require("../config.js");

const dynamicJoinRequests = new Map();

async function dynamicVerifyCommand(ctx) {
  const user = ctx.from;

  const welcomeMsg = `Welcome, ${user.first_name}! Please verify your Dynamic.xyz account to proceed.`;

  const verifyButton = new InlineKeyboard().webApp(
    "🌐 Verify with Dynamic.xyz",
    `${config.reactUrl}?id=${user.id}`
  );

  const sentMessage = await ctx.reply(welcomeMsg, {
    parse_mode: "HTML",
    reply_markup: verifyButton,
  });

  dynamicJoinRequests.set(user.id.toString(), {
    msgId: sentMessage.message_id,
    isVerified: false,
  });

  setTimeout(async () => {
    const joinReq = dynamicJoinRequests.get(user.id);
    if (joinReq && !joinReq.isVerified) {
      await ctx.reply("Verification timeout. Please start the process again.");
      await ctx.deleteMessage(joinReq.msgId);
    }
  }, 5 * 60 * 1000); // Timeout after 5 minutes if not verified
}

// dynamicVerification.js (server-side)
async function dynamicVerifyPost(req, res) {
  const { dynamicUserId, telegramUserId } = req.body;

  try {
    // Send the verification message to the Telegram user
    await bot.tg.api.sendMessage(
      telegramUserId,
      `Your Dynamic.xyz account has been verified! Your Dynamic User ID is: ${dynamicUserId}`
    );

    bot.tg.WebApp.close();

    res.send("Verification message sent successfully!");
  } catch (error) {
    console.error("Error sending verification message:", error);
    res
      .status(500)
      .send("An error occurred while sending the verification message.");
  }
}

module.exports = {
  dynamicVerifyPost,
  dynamicVerifyCommand,
};
