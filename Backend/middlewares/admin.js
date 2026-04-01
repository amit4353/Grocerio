exports.isAdmin = (req, res, next) => {
    if(req.user.email !== process.env.ADMIN_EMAIL){
        return res.status(403).json({
            success : false,
            message : "Admin route only"
        })
    }
    next()
}