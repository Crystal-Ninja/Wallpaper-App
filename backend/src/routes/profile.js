import { Router } from "express";
import {proAuth}  from "../middleware/proauth.js";

const router = Router();


router.get("/", proAuth, async (req, res) => {
  console.log("User from DB:", req.user); // 👈 check if name exists
  res.json({
    name: req.user.name,
    email: req.user.email,
    avatar: req.user.avatar,
    createdAt: req.user.createdAt
  });
});

export default router;
