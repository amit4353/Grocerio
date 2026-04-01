const db = require("../config/db.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


//Register new user;
exports.registerUser = async (req,res) => {
    try{
        const {name, email, password, phone_number, address} = req.body;

        if(!name || !email || !password || !phone_number || !address){
            return res.status(400).json({
                message : "All fields are required"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = "INSERT INTO users (name, email, password, phone_number, address) VALUES (?,?,?,?,?)";
        db.query(sql, [name, email, hashedPassword, phone_number, address] ,(err, result) => {
            if(err) {
                if(err.code === "ER_DUP_ENTRY"){
                    return res.status(400).json({
                        message : "Email already exists"
                    });
                }
                return res.status(500).json(err);
            }

            res.status(201).json({
                message : "User registered Successfully"
            })
        })

    } catch (err){
        res.status(500).json({
            message : "Server Error",
            error : err.message
        })
    }
}

// login user
exports.loginUser = async (req,res) => {
    try{
        const {email , password} = req.body;
        
        if(!email || !password){
            return res.status(400).json({
                message : "Email and Password are required"
            });
        };

        const sql = "SELECT * FROM users WHERE email = ?";

        db.query(sql,[email],async (err,result) => {
            if(err){
                return res.status(500).json(err);
            }

            if(result.length === 0){
                return res.status(404).json({
                    message : "User Not Found!"
                })
            }

            const user = result[0];

            // compare password
            const isMatch = await bcrypt.compare(password, user.password);

            if(!isMatch){
                return res.status(401).json({
                    message : "Invalid Password"
                });
            }
            
            // jwt token generate
            const token = jwt.sign(
                {id : user.id, email : user.email},
                process.env.JWT_SECRET,
                {expiresIn : "1d"}
            )

            res.cookie("token", token, {
                httpOnly: true,
                secure: false
            });


            const isAdmin = (user.email === process.env.ADMIN_EMAIL);
            // console.log("DB email:", user.email);
            // console.log("ENV email:", process.env.ADMIN_EMAIL);
            // console.log("Match:", user.email === process.env.ADMIN_EMAIL);


            res.json({
                message : "Login Successfully ",
                token,
                user : {
                    id : user.id,
                    name : user.name,
                    email : user.email,
                    isAdmin : isAdmin
                }
            });
        });


    } catch (err){
        res.status(500).json({
            message : "Server Error",
            error : err.message
        })
    }
}

exports.logout = (req,res) => {
    try{
        res.cookie("token","",{
            httpOnly : true,
            expires : new Date(0)
        })

        return res.status(200).json({
            success : true,
            message : "Logout successfully!"
        })

    }catch(err){
        return res.status(500).json({
            success : false,
            message : err.message
        })
    }
}

// Get all users
exports.getAllUsers = (req,res) => {
    const sql = "SELECT * FROM users";
    db.query(sql,(err,result) => {
        if(err){
            return res.status(500).json(err);
        }
        res.json(result);
    })
}

exports.deleteUser = (req,res) => {
    try{
        const userId = req.user.id;
        if(!userId){
            return res.status(400).json({
                message : "Please provide ID"
            })
        }

        db.query("DELETE FROM users WHERE id = ?" , [userId] , (err,res) => {

        })

    } catch (err){
        res.status(500).json({
            message : "Server Error",
            error : err.message
        })
    }
}

// Get user Profile 
exports.getUserProfile = (req, res) => {     
    try{
        const userId = req.user.id;
        if(!userId){
            return res.status(400).json({
                message : "Please provide ID"
            })
        }

        db.query("SELECT id, name, email, phone_number, address, created_at FROM users WHERE id=?", [userId] , (err, user) => {
            
            if(err){
                return res.status(500).json(err);
            }

            if(user.length === 0){
                return res.status(404).json({
                    message : "User not found"
                })
            }

            console.log("user : ",user[0]);
            res.status(200).json(user[0]);
        })


    } catch (err){
        res.status(500).json({
            message : "Server Error",
            error : err.message
        })
    }
}

exports.updateUserProfile = (req, res) => {
    const userId = req.user.id;
    const {name , phone_number, address} = req.body;        

    let fields = [];
    let values = [];
    
    if(name){
        fields.push("name = ?");
        values.push(name);
    }

    if(phone_number){
        fields.push("phone_number = ?");
        values.push(phone_number);
    }

    if(address){
        fields.push("address = ?");
        values.push(address);
    }

    if(fields.length === 0){
        return res.status(400).json({
            message : "No fields to be updated"
        })
    }

    const sql = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
    values.push(userId);

    db.query(sql,values, (err, result) => {
        if(err) {
            return res.status(500).json(err);
        }
        res.json({
            message : "User profile updated successfull",
            data : result
        })
    })
}

exports.updatePassword = (req, res) => {
    const userId = req.user.id;
    const {oldPassword , newPassword} = req.body;
    
    if(!oldPassword || !newPassword){
        return res.status(400).json({
            message : "Old password and new password are required",
        });
    }

    const sql = "SELECT * FROM users WHERE id = ?";

    db.query(sql, [userId], async (err, user) => {
        if(err){
            return res.status(500).json(err);
        }

        if(user.length === 0){
            return res.status(404).json({
                message : "User not found!"
            })
        }

        const isMatch = await bcrypt.compare(oldPassword, user[0].password);

        if(!isMatch){
            return res.status(400).json({
                message : "Old password is incorrect",
                oldPassword : oldPassword
            })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        db.query("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, userId], (err,result) => {
            if(err){
                return res.status(500).json(err);
            }

            res.status(200).json({
                message : "Password Updated successfully"
            })
        })
    })
    
}