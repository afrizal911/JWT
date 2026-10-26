const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) throw new Error('JWT_SECRET belum diset di .env');

module.exports = function auth(req, res, next) {
    try{
        //Ambil header autorization : bearer
        const authHeader = req.headers['authorization'];
        if(!authHeader) return res.status(401).json({message : 'No Token Dek'});

        const parts = authHeader.split(' ');
        if(parts.length !==2 || parts[0] !== 'Bearer') {
            return res.status(401).json({message : 'Invalid authorization format'});
        }
        const token = parts[1];


        jwt.verify(token, jwtSecret, (err, decoded) => {
            if(err) return res.status(401).json({message : 'Invalid Token'});


            req.user = { id : decoded.id, email: decoded.email};
            next();
        })
    }catch(err) {
        next(err);
    }
}