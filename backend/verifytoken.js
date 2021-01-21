
const jwt =require('jsonwebtoken');

function auth(req,res) {
    const token = req.header('token');
    if(!token){
        return res.status(401).send('access denied');
    }
    try{
        const verified= jwt.verify(token,process.env.TOKEN_SECRET);
        req.user=verified;
    }
    catch(err){
        res.status(400).send('invalid token')
    }
}

module.exports.auth;