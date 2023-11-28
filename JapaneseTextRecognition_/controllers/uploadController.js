const UploadHistory = require('../models/uploadHistoryModel');

exports.createUpload = async(req, res, next) => {
    try {
        const newUpload = await UploadHistory.create(req.body);
        
        res.status(201).json({
            status: 'success',
            data: {
                upload: newUpload
            }
        })
    }
    catch (err) {
        return res.status(400).json({
            status: 'fail',
            message: {
                err
            }
        })
    }
}

exports.getUpload = async(req, res, next) => {
    try {
        const upload = await UploadHistory.findById(req.params.id);
        if(!upload){
            return res.status(404).json({
                status: 'fail',
                message: 'No upload with that Id'
            })
        }
        
        res.status(201).json({
            status: 'success',
            data: {
                upload
            }
        })

    }
    catch (err) {
        return res.status(400).json({
            status: 'fail',
            message: {
                err
            }
        })
    }
}