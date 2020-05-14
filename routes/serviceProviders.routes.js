const express = require("express");
const router = express.Router();

const UserController = require('../controllers/users.controllers');
const checkAuth = require('../middleware/check-auth');

// // router.get("/",UserController.sampleUser);
// router.get("/",UserController.getAll);
// router.post("/login",UserController.loginUser);

// router.get("/:_id",UserController.getSingleUser);
// // router.post("/",UserController.addUser);
// router.put("/:_id", UserController.updateUser);
// router.delete("/:_id", UserController.deleteUser);
router.post("/serviceProviderRegistration",UserController.registerServiceProvider);
router.post("/login",UserController.serviceProviderLogin);
router.post("/getServiceProvider",UserController.getServiceProvider);
router.get("/getAllServiceProviders",UserController.getAllServiceProviders);
module.exports = router;