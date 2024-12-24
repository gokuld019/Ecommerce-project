import express from "express";
import { registerUser, loginUser, getUserProfile , updateUserProfile } from "../controllers/user.js";

const router = express.Router();


router.post("/user/SignUp", registerUser);
router.post("/user/login", loginUser);

router.put('/profile/:userID', updateUserProfile);
router.get("/profile/:userID", getUserProfile); 

export default router;
