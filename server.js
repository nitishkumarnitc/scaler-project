const http = require("http");
const app = require("./app/app");
require("dotenv").config();
require("colors");
// database connection
require("./config/db_connect");
require("./config/redis_connect")
// ports
const port = process.env.PORT || 3001;
// initialize server
const server = http.createServer(app);

server.listen(port, () => {
  console.log(` server is running on port : ${port} `.black.bgGreen.bold);
});
