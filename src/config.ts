export const AppConfig = {
  JwtSecretKey: process.env.JWT_SECRET_KEY || "jwt_secret_key",
  Tz: process.env.TZ || "Asia/Jakarta",
  Hostname: process.env.HOSTNAME || "http://localhost:3001",
};
