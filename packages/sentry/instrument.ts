import * as Sentry from "@sentry/bun";

// Ensure to call this before importing any other modules!
Sentry.init({
  enabled: process.env.ENABLE_SENTRY !== "false",
  dsn: "https://b5e840756db701d30262e40bd45dd1da@o1285119.ingest.us.sentry.io/4511020243025920",
  // Adds request headers and IP for users, for more info visit:
  // https://docs.sentry.io/platforms/javascript/guides/bun/configuration/options/#sendDefaultPii
  sendDefaultPii: true,
  // Add Performance Monitoring by setting tracesSampleRate
  // Set tracesSampleRate to 1.0 to capture 100% of transactions
  // We recommend adjusting this value in production
  // Learn more at
  // https://docs.sentry.io/platforms/javascript/configuration/options/#traces-sample-rate
  tracesSampleRate: 0.3,
  // Enable logs to be sent to Sentry
  enableLogs: true,
});
