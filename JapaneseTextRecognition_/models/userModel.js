const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, 'Please tell us your name']
    },
    email: {
        type: String,
        require: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo: String,
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        require: [true, 'Please provide your password'],
        minlength: 8,
    },
    passwordConfirm: {
        type: String,
        require: [true, 'Please confirm your password'],
        validate: {
            // this only works on CREATE and SAVE
            validator: function(vl) {
                return vl === this.password;
            },
            message: 'Password are not the same'
        }
    }
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

userSchema.virtual('uploads', {
    ref: 'UploadHistory',
    foreignField: 'user',
    localField: '_id'
})

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next();
    this.passwordConfirm = undefined;
});

userSchema.methods.isCorrectPassword = function(cadidatePassword, userPassword) {
    return cadidatePassword === userPassword;
};


const User = mongoose.model('User', userSchema);

module.exports = User;