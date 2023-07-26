/*
 * Copyright (c) 2023 NurMarvin (Marvin Witt)
 * Licensed under the Open Software License version 3.0
 */
import "dotenv/config";

import z from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
  BASE_URL: z.string().url(),
});

const env = envSchema.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}

process.env = {
  ...process.env,
  ...env,
};
