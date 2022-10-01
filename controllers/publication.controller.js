const PublicationModel = require("../models/publication.model");
const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.getAll = async (req, res) => {
  PublicationModel.find((err, docs) => {
    if (!err) res.status(200).json({ data: docs });
    else console.log("errrer", err);
  }).sort({ createdAt: -1 });
};

module.exports.create = async (req, res) => {
  //    const newPublication = new publicationModel({
  //     posterId: req.body.posterId,
  //     message: req.body.message,
  //     video: req.body.video,
  //     likers: [],
  //     comments: []
  //    })
  let data = {
    posterId: req.body.posterId,
    message: req.body.message,
    video: req.body.video,
    likers: [],
    comments: [],
  };

  try {
    // const publication = await newPublication.create();
    const publication = await PublicationModel.create(data);
    return res.status(201).json({ data: publication, succes: "succes" });
  } catch (error) {
    res.status(500).json({ err: error });
  }
};

module.exports.update = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("id unknow" + req.params.id);

  const updateRecord = {
    message: req.body.message,
  };
  PublicationModel.findByIdAndUpdate(
    req.params.id,
    { $set: updateRecord },
    { new: true }
  )
    .then((docs) => {
      return res
        .status(200)
        .json({ succes: "publication updated", data: docs });
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
};

module.exports.destroy = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("id unknow" + req.params.id);

  PublicationModel.findByIdAndRemove(req.params.id)
    .then((docs) => {
      return res.status(200).json({ succes: "publication supprimer" });
    })
    .catch((err) => {
      return res.status(500).json({ err });
    });
};

module.exports.like = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("id unknow" + req.params.id);
  try {
    await PublicationModel
      .findByIdAndUpdate(
        req.params.id,
        {
          $addToSet: { likers: req.body.id_user },
        },
        { new: true }
      )
      .then((docs) => {
        // return res.status(200).json({succes: 'publication liker',data: docs})
      })
      .catch((err) => {
        return res.status(500).json({ err });
      });
    await UserModel.findByIdAndUpdate(
      req.body.id_user,
      {
        $addToSet: { likes: req.params.id },
      },
      { new: true }
    )
      .then((docs) => {
        return res.status(200).json({ succes: "publication liker" });
      })
      .catch((err) => {
        return res.status(500).json(err);
      });
  } catch (error) {
    return res.status(500).json({ err });
  }
};

module.exports.unlike = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("id unknow" + req.params.id);
    try {
        await PublicationModel
          .findByIdAndUpdate(
            req.params.id,
            {
              $pull: { likers: req.body.id_user },
            },
            { new: true }
          )
          .then((docs) => {
            // return res.status(200).json({succes: 'publication liker',data: docs})
          })
          .catch((err) => {
            return res.status(500).json({ err });
          });
        await UserModel.findByIdAndUpdate(
          req.body.id_user,
          {
            $pull: { likes: req.params.id },
          },
          { new: true }
        )
          .then((docs) => {
            return res.status(200).json({ succes: "publication unliker" });
          })
          .catch((err) => {
            return res.status(500).json(err);
          });
      } catch (error) {
        return res.status(500).json({ err });
      }

};

module.exports.comments = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("id unknow" + req.params.id);

    try {
        console.log(req.body);
        await PublicationModel.findByIdAndUpdate(
            req.params.id,
            {
                $push: {
                    comments: {
                        user_id: req.body.user_id,
                        user_firstname: req.body.user_firstname,
                        text: req.body.text,
                        timestamps: new Date().getTime()
                    }
                }
            },
            { new: true }
        ).then((docs) => {
            return res.status(200).json({data: docs,succes: 'commentaire créer'})
        }).catch((err) => {
            return res.status(500).json({error: err})
        })
    } catch (error) {
        return res.status(500).json({error: error})
    }
}

module.exports.editComment = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("id unknow" + req.params.id);
    console.log('etoooo ');
    try {
        await PublicationModel.findById(
            req.params.id
        ).then((docs) => {
            console.log('fdffdfdf');
            const comment = docs.comments.find(el => el.id == req.body.comment_id)
            console.log('comment',comment);
            if(!comment) return res.status(404).json('commentaire not found')
            comment.text = req.body.text

            return docs.save((err) => {
                if(!err) return res.status(200).json(docs)
                return res.status(500).json({errer: errer})
            })
        })
    } catch (error) {
        return res.status(404).json('commentaire not found')
    }
}

module.exports.deleteComment = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("id unknow" + req.params.id);
    
    try {
        await PublicationModel.findByIdAndUpdate(
            req.params.id,
            {
                $pull: {
                    comments: {
                        _id: req.body.comment_id
                    }
                }
            },
            {new: true}
        ).then((docs) => {
            return res.status(200).json({succes: 'commentaire suprimer'})
        }).catch((error) => {
            return res.status(500).json({errer: error})
        })
    } catch (error) {
        return res.status(500).json({errer: error})
    }
}