// server.js
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB setup
mongoose.connect("mongodb://127.0.0.1:27017/student_orders", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.once("open", () => console.log("Connected to MongoDB"));

// Define a schema for the data
const orderSchema = new mongoose.Schema({
  name: String,
  year: String,
  branch: String,
  item: String,
  phone: String,
  quantity: Number,
});

const Order = mongoose.model("Order", orderSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/index.html");
// });
app.use(express.static(path.join(__dirname, "../frontend")));

// Routes
app.get("/", (req, res) => {
  // Send the index.html file from the frontend directory
  res.sendFile(path.join(__dirname, "../frontend", "index.html"));
});

app.post("/submit", (req, res) => {
  const { name, year, branch, item, phone, quantity } = req.body;

  const newOrder = new Order({
    name,
    year,
    branch,
    item,
    phone,
    quantity,
  });

  newOrder
    .save()
    .then(() =>
      res.sendFile(path.join(__dirname, "../backend", "success.html"))
    ) // Send success.html from the backend directory upon successful submission
    .catch((err) =>
      res.sendFile(path.join(__dirname, "../backend", "error.html"))
    );
});

// Start the server
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
