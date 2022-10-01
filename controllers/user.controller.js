const UserModel = require('../models/user.model')
const ObjectID = require('mongoose').Types.ObjectId;


module.exports.getAllUsers = async (req, res) => {
    const users = await UserModel.find().select('-password');
    res.status(200).json({users: users})
}

module.exports.userInfo = async (req, res) => {
    console.log(req.params);
    if(!ObjectID.isValid(req.params.id)) return res.status(400).send('id unknow:' + res.params.id)
    UserModel.findById(req.params.id,(err, docs) => {
        if(!err) res.send(docs)
        else console.log('id unknow' + err)
    }).select('-password');
}

module.exports.modifyUser = async (req, res) => {
    if(!ObjectID.isValid(req.params.id)) return res.status(400).send('id unknow:' + res.params.id)
    try {
        await UserModel.findOneAndUpdate(
            {_id: req.params.id},
            {
                $set: {
                    bio: req.body.bio
                }
            },
            {new: true, upsert: true, setDefaultsOnInsert: true},
            // (err, docs) => {
            //     if(!err) return res.send(docs)
            //     if(err) return res.status(500).send({message: err})
            // }
        ).then((docs) => {
            return res.send(docs)
        }).catch((err) => {
            return res.status(500).send({message: err})
        })
    } catch (error) {
        return res.status(500).send({message: error})
    }
}

module.exports.deleteUser = async (req, res ) => {
    if(!ObjectID.isValid(req.params.id)) return res.status(400).send('id unknow:' + res.params.id)
    try {
        await UserModel.remove({_id: req.params.id}).exec();
        res.status(200).json({message: 'successfully deleted'})
    } catch (error) {
        return res.status(500).send({message: error})
    }
}