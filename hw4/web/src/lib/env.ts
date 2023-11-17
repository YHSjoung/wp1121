import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_SOCKET_URL: z.string().url(),
  NEXT_PUBLIC_POSTGRES_URL: z.string().url(),
  NEXT_PUBLIC_JWT_SECRET: z.string(),
  NEXT_PUBLIC_JWT_EXPIRES_IN: z.string(),
});
type Env = z.infer<typeof envSchema>;

export const env: Env = {
  NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL!,
  NEXT_PUBLIC_POSTGRES_URL: process.env.NEXT_PUBLIC_POSTGRES_URL!,
  NEXT_PUBLIC_JWT_SECRET: process.env.NEXT_PUBLIC_JWT_SECRET!,
  NEXT_PUBLIC_JWT_EXPIRES_IN: process.env.NEXT_PUBLIC_JWT_EXPIRES_IN!,
};

envSchema.parse(env);
