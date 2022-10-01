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

module.exports.followUser = async  (req, res) => {
    if(!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToFollow)) 
    return res.status(400).send('id unknow:' + res.params.id)
    try {
        // add to the follower list
        await UserModel.findByIdAndUpdate(
            req.params.id,
            {$addToSet: {following: req.body.idToFollow}},
            {new: true, upsert: true},
        ).then((docs) => {
            return res.status(200).json(docs)
        }).catch((err) => {
            return res.status(500).json({message: err})
        })
        //  add to following list
        await UserModel.findByIdAndUpdate(
            req.body.idToFollow,
            {
                $addToSet: { followers : req.params.id}
            },
            {new: true, upsert: true},
        ).then((docs) => {
        }).catch((err) => {
            return res.status(500).json({message: err})
        })
    } catch (error) {
        return res.status(500).send({message: error})
    }
}

module.exports.unfollowUser = async  (req, res) => {
    if(!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToUnFollow)) 
     return res.status(400).send('id unknow:' + res.params.id)
    try {
        // add to the follower list
        await UserModel.findByIdAndUpdate(
            req.params.id,
            {$pull: {following: req.body.idToUnFollow}},
            {new: true, upsert: true},
        ).then((docs) => {
            return res.status(200).json(docs)
        }).catch((err) => {
            return res.status(500).json({message: err})
        })
        //  add to following list
        await UserModel.findByIdAndUpdate(
            req.body.idToUnFollow,
            {
                $pull: { followers : req.params.id}
            },
            {new: true, upsert: true},
        ).then((docs) => {
        }).catch((err) => {
            return res.status(500).json({message: err})
        })
    } catch (error) {
        return res.status(500).send({message: error})
    }
}