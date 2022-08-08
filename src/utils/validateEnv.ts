import { cleanEnv, str, port } from "envalid";

const validateEnv = () =>
  cleanEnv(process.env, {
    MONGO_PASSWORD: str(),
    MONGO_PATH: str(),
    MONGO_USER: str(),
    PORT: port(),
  });

export { validateEnv };
