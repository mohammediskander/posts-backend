const express = require("express");
const router = express.Router();

const {
  getUsers,
  createUser,
  loginUser,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/user");

router.route("/").get(getUsers);
router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);
router.route("/register").post(createUser);
router.route("/login").post(loginUser);

module.exports = router;
