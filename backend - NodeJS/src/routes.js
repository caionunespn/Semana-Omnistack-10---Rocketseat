const { Router } = require("express");
const routes = Router();

const devController = require("./controllers/devController");
const searchController = require("./controllers/searchController");

routes.get("/devs", devController.index);
routes.post("/devs", devController.store);
routes.delete("/devs/:id", devController.destroy);

routes.get("/search", searchController.index);
module.exports = routes;