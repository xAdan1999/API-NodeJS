const userController = require('../controllers/user.controller');  
const verifyToken = require('../controllers/verifyToken')
const express = require('express');
const router = express();

router.post("/signup", userController.signUp);
router.post("/login", userController.login);
router.put("/:id", verifyToken, userController.updateUser);
router.delete("/:id", verifyToken, userController.deleteUser);

module.exports = router;