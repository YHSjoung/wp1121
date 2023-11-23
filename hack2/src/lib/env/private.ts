import { z } from "zod";

const privateEnvSchema = z.object({
  // TODO: 1.2 Add your private environment variables here for your database (postgres)
  // TODO: 1.2 end
});

type PrivateEnv = z.infer<typeof privateEnvSchema>;

export const privateEnv: PrivateEnv = {
  // TODO: 1.3 Add your private environment variables here for your database (postgres)
  // TODO: 1.3 end
};

privateEnvSchema.parse(privateEnv);
