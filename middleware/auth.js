const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req,res,next){
//get token from header
const token = req.header('x-auth-token');

//check if no token
if(!token){
    return res.status(401).json({msg:'no token'});
}
try{
    const decoded = jwt.verify(token, config.get('jwtSecret')); //returns an object
    req.user = decoded.user; //turns req.user into the payload recieved => user: { id: user.id }
    next();
}catch(err){
    res.status(401).json({msg:'token not valid'});
}
}