const UserModel = require('../models/user.model')
const jwt = require('jsonwebtoken')
const { singUpErrors, signInErrors } = require('../utils/errors.utils')

const maxAge = 3 * 24 * 60 * 60 * 1000
const createToken = (id) => {
    return jwt.sign({id},process.env.TOKEN_SECRET, {
        expiresIn: 3 * 24 * 60 * 60 * 1000
    })
}

module.exports.singUp = async (req, res) => {
    console.log("request",req.body);
    const  { username, email ,firstname, password } = req.body

    try {
        const user = await UserModel.create({username, email ,firstname, password});
        res.status(201).json({user: user})
    } catch (error) {
        const errors = singUpErrors(error)
        res.status(200).json({err: errors})
    }
}

module.exports.singIn = async (req,res) => {
    const {email,password} = req.body

    try {
        const  user = await UserModel.login(email,password)
        const token = createToken(user._id)
        res.cookie('jwt',token, { httpOnly: true,maxAge :maxAge})
        res.status(200).json({user: user._id})
    } catch (error) {
        res.status(200).json({error: error})
    }
}
module.exports.logout = async (req,res) => {
    res.cookie('jwt','',{maxAge: 1})
    // res.redirect('/');
    res.status(200).json({message: 'logged'})
}