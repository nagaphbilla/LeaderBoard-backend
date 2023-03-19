require('dotenv').config();
const jwt = require('jsonwebtoken');
const auth = (req,re,next)=>{
try{
    const token = req.header("x-auth-token");
    if(!token)
    return res.statues(401).json({msg:"No authentication token,access denied"});
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