const express = require("express");
const router = express.Router();
const userController = require("../controllers/userControllers.js");
const authMiddleware = require("../middleware/authmiddleware.js");

router
  .route("/")
  .post(userController.RegisterUser)
  .get(authMiddleware.protect, authMiddleware.admin, userController.getUser);
router.post("/logout", userController.logoutUser);
router.post("/auth", userController.authUser);
router
  .route("/profile")
  .get(authMiddleware.protect, userController.getUserProfile)
  .put(authMiddleware.protect, userController.updateUserProfile);
router
  .route("/:id")
  .delete(
    authMiddleware.protect,
    authMiddleware.admin,
    userController.deleteUser
  )
  .get(authMiddleware.protect, authMiddleware.admin, userController.getUserByID)
  .put(authMiddleware.protect, authMiddleware.admin, userController.updateUser);

module.exports = router;
