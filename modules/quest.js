// const { InlineKeyboard } = require("grammy");
// const bot = require("../bot.js");
// const { config } = require("../config.js");

// const quizQuestions = [
//   {
//     question: "What is the native cryptocurrency of the Ethereum blockchain?",
//     options: ["Bitcoin", "Ether", "Litecoin", "Ripple"],
//     correctAnswer: "Ether",
//   },
//   {
//     question:
//       "What is the purpose of smart contracts on the Ethereum blockchain?",
//     options: [
//       "To store cryptocurrency",
//       "To automate the execution of agreements",
//       "To mine new blocks",
//       "To perform online transactions",
//     ],
//     correctAnswer: "To automate the execution of agreements",
//   },
//   {
//     question: "What is the average block time on the Ethereum blockchain?",
//     options: ["10 seconds", "30 seconds", "1 minute", "5 minutes"],
//     correctAnswer: "30 seconds",
//   },
//   {
//     question:
//       "What is the name of the programming language used to write smart contracts on Ethereum?",
//     options: ["Java", "Python", "Solidity", "C++"],
//     correctAnswer: "Solidity",
//   },
//   {
//     question:
//       "What is the term used to describe the transition of Ethereum from Proof-of-Work to Proof-of-Stake?",
//     options: ["The Flippening", "The Merge", "The Fork", "The Upgrade"],
//     correctAnswer: "The Merge",
//   },
// ];

// bot.tg.use(async (ctx, next) => {
//   if (ctx.callbackQuery && ctx.callbackQuery.data.startsWith("answer_")) {
//     await handleAnswer(ctx);
//   } else {
//     await next();
//   }
// });

// async function questCommand(ctx) {
//   const user = ctx.from;
//   let currentQuestion = 0;
//   let score = 0;

//   const askQuestion = async () => {
//     const question = quizQuestions[currentQuestion];
//     const options = question.options.map((option, index) => ({
//       text: option,
//       callback_data: `answer_${index}`,
//     }));

//     const keyboard = new InlineKeyboard().add(...options);

//     const questionMsg = `❓ <b>Question ${currentQuestion + 1}:</b>\n${
//       question.question
//     }`;

//     await ctx.replyWithHTML(questionMsg, {
//       reply_markup: keyboard,
//     });
//   };

//   const handleAnswer = async (ctx) => {
//     const selectedAnswer =
//       quizQuestions[currentQuestion].options[
//         Number(ctx.callbackQuery.data.split("_")[1])
//       ];
//     const isCorrect =
//       selectedAnswer === quizQuestions[currentQuestion].correctAnswer;

//     if (isCorrect) {
//       score++;
//       await ctx.answerCallbackQuery("✅ Correct answer!");
//     } else {
//       await ctx.answerCallbackQuery("❌ Wrong answer!");
//     }

//     currentQuestion++;

//     if (currentQuestion < quizQuestions.length) {
//       await askQuestion();
//     } else {
//       const resultMsg = `🎉 <b>Congratulations, ${user.first_name}!</b>\nYou have completed the Ethereum quiz. Your score is: ${score}/${quizQuestions.length}`;
//       await ctx.replyWithHTML(resultMsg);
//     }
//   };

//   const welcomeMsg = `✨ <b>Welcome, ${user.first_name}, to the Ethereum Quiz!</b>

// 📚 Test your knowledge of Ethereum by answering the following questions.

// Let's get started! 🚀`;

//   await ctx.replyWithPhoto("https://i.ibb.co/5MBjt9Q/Spicy-Fans.png", {
//     caption: welcomeMsg,
//     parse_mode: "HTML",
//   });

//   await askQuestion();
// }

// module.exports = {
//   questCommand,
// };
