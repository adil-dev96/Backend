


import "dotenv/config";
import app from "./src/app.js";
import connectDB from "./src/config/database.js";



const PORT = process.env.PORT || 8000;

connectDB().catch((err) => {
  console.log("MongoDB connection failed:", err);
  process.exit(1);
});

app.listen(PORT, () => {
  console.log(`server is running on PORT ${PORT}`);
});
