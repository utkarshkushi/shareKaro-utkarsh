const router = require("express").Router();
const File = require('../models/fileModel');

router.get('/:uuid', async (req,res)=>{
    try {
        const file = await File.findOne({uuid: req.params.uuid});
        if(!file){
            return res.render('download', {error: "link got expired"});
        }
        return res.render('download', {
            uuid: file.uuid,
            filename: file.filename,
            filesize: file.size,
            download: `${process.env.APP_BASE_URL}/files/download/${file.uuid}`
        })

    } catch (error) {
        return res.render('download', {error: "something went wrong"});
    }
})


module.exports = router;