const express = require("express");
const cors = require("cors");
require("dotenv").config();

const placesRouter = require("./routes/places");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/places", placesRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});