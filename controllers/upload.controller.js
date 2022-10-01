const UserModel = require('../models/user.model')
const fs = require('fs')
const { promisify } = require('util')
const pipeline = promisify(require('stream').pipeline)


module.exports.uploadProfil = async (req,res,next) => {
    try {
        const imgdata = req.body.image;
        console.log("sddsd");
        const buffer = Buffer.from(
            imgdata.split('base64,')[1],  // only use encoded data after "base64,"
            'base64'
          )
          var mime = imgdata.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
    
            if (mime && mime.length) {
                result = mime[1].split('/').pop();
            }
            var dir = 'public/profiles';
            console.log('ererer',fs.existsSync(dir));
            if (!fs.existsSync(dir)){
                fs.mkdirSync(dir, { recursive: true });
                console.log('Folder Created Successfully.');
            }
            fs.writeFileSync(`public/profiles/${new Date().getTime().toString() + '.'+ result}`, buffer)
            return res.status(200).json(result)

    } catch (e) {
        next(e);
    }
}