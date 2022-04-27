const jwt = require('jsonwebtoken');


module.exports = async (req,res,next) => {
    try{
    const token = await req.header('Authorization');
    if(!token) {
        return res.status(401).json({
            message: "Access Rejected",
        })
    } else {
        const verify = jwt.verify(token,'User');
        req.user = verify;
        next();
    }

    
}catch(e) {
    console.log(e);
  }
}