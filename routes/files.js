// require('dotenv').config();
const router = require('express').Router();
const multer = require('multer');
const File = require('../models/fileModel');
const path = require('path');
const { v4: uuid4} = require('uuid');

const storage = multer.diskStorage({
    destination: (req,file,cb)=> cb(null, './uploads'),
    filename: (req,file,cb)=> cb(null, Date.now() +"-"+file.originalname)
})

let upload = multer({
    storage: storage,
    limits: {fileSize: 1000000*100}
});

router.post('/',upload.single('myfile'), async(req,res)=>{
    console.log(req.headers);
    console.log(req.file);

    if(!req.file){
        return res.json({error: "no file found"})
    }
    const file = new File({
        filename: req.file.filename,
        uuid: uuid4(),
        path: req.file.path,
        size: req.file.size
    })

    console.log(file);
    const response = await file.save();
    return res.json({file: `${process.env.APP_BASE_URL}/files/${response.uuid}`});

})


router.post('/send', async (req,res)=>{
    const {uuid, emailTo, emailFrom} = req.body;

    if(!uuid || !emailTo || !emailFrom){
        return res.status(422).send({error: "all fields are required"});
    }
    const file = await File.findOne({uuid: uuid})
    if(file.sender){
        return res.status(422).send({error: "email already sent"});
    }

    file.sender = emailFrom;
    file.receiver = emailTo;
    const response = await file.save();

    //send mail
    const sendMail = require('../services/sendMail');
    sendMail({
        from: emailFrom,
        to: emailTo,
        subject: "shareKaro file sharing",
        text: `${emailFrom} has sent you a file`,
        html: require('../services/emailTemplate')({
            emailFrom: emailFrom,
            downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
            size: parseInt(file.size/1000) + 'KB',
            expires: "24 hours"
        })
    })
    return res.send({success: true});
})

module.exports = router;