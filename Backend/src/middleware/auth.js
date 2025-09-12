import bcrypt from "bcrypt";
import {Router} from "express";
import jwt from "jsonwebtoken";
import { User} from "../models/user.js"

const router=Router();


router.post("/register",async(req,res,next)=>{
    try {
        const {email,name,password}=req.body;
        const exists=await User.findOne({email});
        if(exists){
            return res.status(400).json({message:"email in use"});
        }
        const passwordHash=await bcrypt.hash(password,10);
        const user=await User.create({name,passwordHash,email});
        res.status(201).json({ id: user._id, email: user.email ,name:user.name});


    } catch (e) {
        if (e.code === 11000) {
            return res.status(400).json({ message: "Email already in use" });
        }
        next(e);
    }
})

router.post("/login",async (req,res,next) => {
    try {
            const {email,password}=req.body;
        const user = await User.findOne({ email }).select("+passwordHash");
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const valid = await bcrypt.compare(password, user.passwordHash);

        if(!user||!valid){
            res.status(401).json({message:"invalid credentials"})
        }

        const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"7d"})
        res.json({ token, user: { id: user._id, email: user.email, name: user.name } });


    } catch (e) {
        next(e)
    }
})
router.post("/logout", (req, res) => {
  res.json({ message: "Logged out successfully. Please remove token on client side." });
});

export default router