import jwt from "jsonwebtoken";


export const requireAuth = (req, res, next) => {
    const header=req.headers.authorization||"";
    const token=header.startsWith("Bearer")?header.slice(7):null;

    if(!token){
        return next({status:401,message:"Unauthorized"});
    }
    try {
    const payload=jwt.verify(token,process.env.JWT_SECRET);
    req.userId=payload.id;
    next();
    } catch (error) {
    next({ status: 401, message: "Invalid or expired token" });
    }
};
