import apiRoute from "./api/api.js";
import authRoute from "./auth/auth.js";


module.exports = (app) => {
  app.use("/api", apiRoute);
  app.use("/auth", authRoute);
}

