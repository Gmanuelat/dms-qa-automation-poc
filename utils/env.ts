import * as dotenv from "dotenv";
import * as fs from "fs";

export function loadEnv() {
  const envPath = ".env";
  if (fs.existsSync(envPath)) dotenv.config({ path: envPath });
  else dotenv.config();
}
