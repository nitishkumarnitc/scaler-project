const express = require("express");
const morgan = require("morgan");
const routeSync = require("../handlers/route_sync.handler");
const cors = require('cors')

// Initialize the Express application
const app = express();
// Middleware
app.use(express.json());
app.use(morgan("dev")); // Log requests to the console (Express 4)
// Initialize cors 
app.use(cors())

// Initialize staff route
routeSync(app, "staff");
// initialize academic route
routeSync(app, "academic");
// initialize learner route
routeSync(app, "learners");

// Define a default route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Handle invalid routes
app.all("*", (req, res) => {
  res.send("Invalid Route");
});

module.exports = app;
