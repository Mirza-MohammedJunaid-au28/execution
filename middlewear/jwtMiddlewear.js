const jwt = require('jsonwebtoken');
const config = require("../config/config.json")

function isAuth(req,res,next){
    const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
    if(!token){
        return res.status(401).send("Unauthorized")
    }
    jwt.verify(token,config.jwtKey,(err,decoded) => {
        if(err){
            return res.status(401).send("Unauthorized")
        }
      req.email = decoded.email;
        next();
    })
}

module.exports = { isAuth }