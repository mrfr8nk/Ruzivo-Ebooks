
import express from "express";
import { registerRoutes } from "../server/routes";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initialize MongoDB and routes
(async () => {
  const { connectToMongoDB } = await import("../server/mongodb");
  await connectToMongoDB();
  
  const { initializeAdmin } = await import("../server/admin");
  await initializeAdmin();
  
  await registerRoutes(app);
})();

export default app;
