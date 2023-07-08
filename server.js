//npm install json-server cors
const jsonServer = require("json-server");
const cors = require("cors");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults(); // to extend functionality

//access request data in a convenient format
server.use(jsonServer.bodyParser);
server.use(middlewares);
server.use(cors());
server.use(
  router
); /*The router handles CRUD (Create, Read, Update, Delete) operations for the data in the db.json file, 
automatically generating appropriate endpoints for each resource defined in the JSON data.*/

server.get("todos", (req, res) => {
  server.status(200).json({
    message: "Reached",
  });
});
server.listen(3000, () => {
  console.log("Json server is running on port 3000");
});
