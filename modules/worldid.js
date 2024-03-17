// worldcoinVerification.js
const { InlineKeyboard } = require("grammy");
const fetch = require("node-fetch");
const { config } = require("../config.js");
const bot = require("../bot.js");

const joinRequests = new Map();

async function verifyCommand(ctx) {
  const user = ctx.from;

  const welcomeMsg = `✨ <b>Welcome ${user.first_name} to SpicyFans!</b>

🪩 A place to collect rewards for your support, 
share your journey and join the chorus.

In order to participate, <i>verify your identity</i> ⤵️`;

  const verifyButton = new InlineKeyboard().webApp(
    "🌐 Verify with World ID",
    `${config.appUrl}/verify/${user.id}`
  );

  const sentMessage = await ctx.replyWithPhoto(
    "https://i.ibb.co/5MBjt9Q/Spicy-Fans.png",
    {
      caption: welcomeMsg,
      parse_mode: "HTML",
      reply_markup: verifyButton,
    }
  );

  joinRequests.set(user.id.toString(), {
    msgId: sentMessage.message_id,
    isVerified: false,
  });

  setTimeout(async () => {
    const joinReq = joinRequests.get(user.id);
    if (joinReq && !joinReq.isVerified) {
      await ctx.reply("Verification timeout. Please start the process again.");
      await ctx.deleteMessage(joinReq.msgId);
    }
  }, 5 * 60 * 1000); // Timeout after 5 minutes if not verified
}

async function onVerified(userId) {
  const joinReq = joinRequests.get(userId);
  if (!joinReq) {
    throw new Error("Can't find the message ID in user dialogue");
  }

  joinReq.isVerified = true;

  if (joinReq.msgId) {
    await bot.tg.api.deleteMessage(userId, joinReq.msgId);
    delete joinReq.msgId;
  }

  await bot.tg.api.sendMessage(
    userId,
    "Congratulations! You have been successfully verified."
  );
}

async function verifyRoute(req, res) {
  const { userId } = req.params;
  const joinReq = joinRequests.get(userId);

  if (!joinReq) {
    return res.status(404).send("Verification request not found.");
  }

  if (!joinReq.msgId) {
    return res.status(409).send("Verification already completed.");
  }

  const page = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>IDKit Playground</title>
      <script src="https://unpkg.com/@worldcoin/idkit-standalone@1.1.4/build/index.global.js"></script>
      <script src="https://telegram.org/js/telegram-web-app.js"></script>
    </head>
    <body>
      <script type="module">
        IDKit.init({
          autoClose: true,
          signal: '${joinReq.msgId}',
          app_id: '${config.appId}',
          action: 'verify-personhood',
          enableTelemetry: true,
          verification_level: 'device',
          action_description: 'Test action description',
          handleVerify: async response => {
              const res = await fetch('/verify', {
                  method: 'POST',
                  body: JSON.stringify({
                      ...response,
                      userId: '${userId}',
                  }),
                  headers: { 'Content-Type': 'application/json' },
              })

              if (res.ok) {
                  console.log(window.Telegram.WebApp.close());
              } else if (res.status === 429) {
                  alert('This World ID has already been used for verification. You cannot do it again!');
              } else {
                  alert('Something went wrong, please try again later.');
              }
          }, 
          onSuccess: response => {
            console.log(response)
          },
        })

        await IDKit.open()
      </script>
    </body>
  </html>`;

  res.send(page);
}

async function verifyPost(req, res) {
  const { proof, merkle_root, nullifier_hash, credential_type, userId } =
    req.body;

  const joinReq = joinRequests.get(userId);

  if (!joinReq) {
    return res.status(404).send("Verification request not found.");
  }

  if (!joinReq.msgId) {
    return res.status(409).send("Verification already completed.");
  }

  try {
    const response = await fetch(
      `https://developer.worldcoin.org/api/v1/verify/${config.appId}`,
      {
        method: "POST",
        headers: {
          "User-Agent": "World ID Telegram Bot",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          proof,
          signal: joinReq.msgId.toString(),
          action: "verify-personhood",
          merkle_root,
          nullifier_hash,
          credential_type,
        }),
      }
    );

    if (!response.ok) {
      const data = await response.json();

      if (data.code === "max_verifications_reached") {
        return res.status(429).send("Too Many Requests");
      }

      console.error("Failed to verify proof:", data);
      return res.status(400).send("Verification failed. Please try again.");
    }

    await onVerified(userId);

    if (config.posthog) {
      config.posthog.capture({
        distinctId: userId.toString(),
        event: "telegram integration verification",
      });
    }

    res.send("Verification successful!");
  } catch (error) {
    console.error("Error during verification:", error);
    res
      .status(500)
      .send("An error occurred during verification. Please try again later.");
  }
}

module.exports = {
  verifyCommand,
  verifyRoute,
  verifyPost,
};
