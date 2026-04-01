const jwt = require("jsonwebtoken");

exports.isAuthenticated = (req, res, next) => {

    try{
        const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

        if(!token){
            return res.status(401).json({
                success : false,
                message : "Please login first."
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        
        next();


    } catch(err){
        return res.status(403).json({
            message : "Invalid or Expire Token!"
        })
    }
}