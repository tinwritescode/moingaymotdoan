import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  functions: {
    history: {
      name: "Reading History API",
      source: "functions/history/index.ts",
      env: {
        WORKOS_CLIENT_ID: { value: process.env.WORKOS_CLIENT_ID, required: true },
        WORKOS_API_HOSTNAME: { value: process.env.WORKOS_API_HOSTNAME, required: false },
        // Reading reminders (Web Push); without both keys the /push routes are off.
        VAPID_PUBLIC_KEY: { value: process.env.VAPID_PUBLIC_KEY, required: false },
        VAPID_PRIVATE_KEY: { value: process.env.VAPID_PRIVATE_KEY, required: false },
        VAPID_SUBJECT: { value: process.env.VAPID_SUBJECT, required: false },
      },
    },
  },
  triggers: {
    "streak-reminders": {
      type: "schedule",
      function: "history",
      // Every 15 minutes (UTC); each device gets at most one reminder a local day.
      cron: "*/15 * * * *",
      functionPath: "/push/cron",
    },
  },
});
