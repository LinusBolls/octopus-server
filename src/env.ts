/*
exports type parsed environment variables (i.e. PORT: "420" becomes PORT: 420) for linting and auto completion purposes.
in staging and prod, these are sourced from process.env (injected via heroku), in development from the local .env file
*/
import { config } from "dotenv";
import { z } from "zod";

const EnvZod = z.object({
  NODE_ENV: z.enum(["production", "development", "testing", "staging"]),
  IS_PROD: z.boolean(),

  DB_CONNECTION_STRING: z.string().url(),

  PORT: z.number(),
  ALLOWED_ORIGINS: z.array(z.string().url()),
});

function getEnvSrc() {
  const { error, parsed } = config();

  if (error || parsed == null) return process.env as { [key: string]: string };

  return parsed;
}

function parseEnv(env: { [key: string]: string }) {
  return {
    ...env,
    NODE_ENV: env.NODE_ENV,
    IS_PROD: env.NODE_ENV === "production",

    PORT: parseInt(env.PORT),
    ALLOWED_ORIGINS: JSON.parse(env.ALLOWED_ORIGINS),
  };
}

function validateEnv(env: { [key: string]: any }) {
  const parsedEnv = EnvZod.safeParse(env);

  if (!parsedEnv.success)
    throw new Error(
      "Failed to Parse Environment Variables: " +
        JSON.stringify(parsedEnv.error.issues, null, 2)
    );

  return parsedEnv.data;
}
export default validateEnv(parseEnv(getEnvSrc()));
