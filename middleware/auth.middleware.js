const jwt = require('jsonwebtoken')
const UserModel = require('../models/user.model')

module.exports.checkUser = (req, res, next) => {
    const token = req.cookies.jwt 
    if(token) {
        jwt.verify(token,process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if(err) {
                res.locals.user = null 
                res.cookie('jwt','', {maxAge: 1})
                next()
            } else {
                let user = await UserModel.findById(decodedToken.id)
                res.locals.user = user
                console.log('userer aty @ middleware',user);
                next()
            }
        })
    } else {
        res.locals.user = null
        next()
    }
}

module.exports.requireAuth = (req, res, next) => {
    const token = req.header('Authorization');
    console.log('token',token);

    // Check if no token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verify token
    try {
        jwt.verify(token.split(' ').pop(), process.env.TOKEN_SECRET, (error, decoded) => {
            if (error) {
                return res.status(401).json({ msg: 'Token is not valid' });
            } else {
                req.user = decoded.user;
                next();
            }
        });
    } catch (err) {
        console.error('something wrong with auth middleware');
        res.status(500).json({ msg: 'Server Error' });
    }
    
    // const token = req.cookies.jwt 
    // if(token) {
    //     jwt.verify(token,process.env.TOKEN_SECRET, async (err, decodedToken) => {
    //         if(err) {
    //             console.log('errre token',err);
    //         } else {
    //             console.log(decodedToken.id);
    //             next()
    //         }
            
    //     })
    // } else {
    //     return res.status(401).send('unauthorized')
    //     console.log('no token');
    // }
}