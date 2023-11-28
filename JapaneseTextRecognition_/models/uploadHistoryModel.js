const mongoose = require('mongoose');

const uploadHistorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        require: [true, 'upload history must belong to a user']
    },
    photo: {
        type: String,
        require: [true, 'Please provide photos you want to convert']
    },
    text: {
        type: String,
        default: '...'
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

// uploadHistorySchema.pre(/^find/, function(next) {
//     this.populate({
//         path: 'user',
//         select: 'name photo'
//     })
//     next();
// });


const UploadHistory = mongoose.model('UploadHistory', uploadHistorySchema);

module.exports = UploadHistory;