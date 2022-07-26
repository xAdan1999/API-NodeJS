const passwordController = require('../controllers/password.controller');
const verifyToken = require('../controllers/verifyToken')
const express = require('express');
const router = express();

router.get("/:user_id", verifyToken, passwordController.getPasswords);
router.get("/:user_id/search", verifyToken, passwordController.searchPassword);
router.post("/", verifyToken, passwordController.insertPassword);
router.put("/:id", verifyToken, passwordController.updatePassword);
router.delete("/:id", verifyToken, passwordController.deletePassword);

module.exports = router;