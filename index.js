const express = require("express");

const geoHandler = require("./handlers/geo");
const profileHandler = require("./handlers/profile");

const app = express();

app.get("/status", (_, res) => {
  res.json({ status: "os" });
});

app.get("/geo", geoHandler);

app.get("/profile", profileHandler);

app.listen(5000, () => {
  console.log("Running on port 5000.");
});

module.exports = app;
