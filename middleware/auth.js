require('dotenv').config();
const jwt = require('jsonwebtoken');
const auth = (req,res,next)=>{
try{
    const { authorization } = req.headers
    if(!authorization)
        return res.status(401).json({msg:"No authentication token,access denied"});
    const token = authorization.replace("Bearer ", "")
    const verified = jwt.verify(token,process.env.JWT_SECRET);
    if(!verified)
        return res.status(401).json({msg:" Token Verification failed,authorization denied"});
 
    req.user = verified.id;

    next();
}
catch(err)
{
    res.status(500).json({error:err.message});
}


}


module.exports = auth;