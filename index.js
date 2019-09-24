const express = require("express");
const mongoose = require("mongoose");
const app = express();
const user = require("./routes/user");
const auth = require("./routes/auth");
const config = require("config");

if (!config.get("jwtKey")) {
  console.error("FATAL ERROR: jwtKey is not defined!");
  process.exit(1);
}
app.use(express.json());

// Create mongodb connection
mongoose
  .connect("mongodb://localhost/users", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("Connecting to MongoDB"))
  .catch(() => console.log("Could not connect to mongodb"));

app.use("/api/user", user);
app.use("/api/auth", auth);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`listen on port ${port}`));
