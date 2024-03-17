require("dotenv").config();

const config = {
  appId: process.env.APP_ID,
  appUrl: process.env.APP_URL,
  reactUrl: process.env.REACT_URL,
  posthog: process.env.POSTHOG_API_KEY
    ? posthog.default(process.env.POSTHOG_API_KEY)
    : null,
};

module.exports = { config };
