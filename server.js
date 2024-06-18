const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 4000;

app.get("/api/health", (req, res) => {
  console.log("hey health!");
  res.json({
    service: "ProManage Server",
    status: "active",
    time: new Date(),
  });
});

app.listen(PORT, () => {
  console.log(`ProManage Server is running on port ${PORT}`);
});
