const UserModel = require('../models/user.model')

module.exports.singUp = async (req, res) => {
    console.log("request",req.body);
    const  { username, email ,firstname, password } = req.body

    try {
        const user = await UserModel.create({username, email ,firstname, password});
        res.status(201).json({user: user})
    } catch (error) {
        res.status(200).send({err: error})
    }
}