const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const util = require('util');

const signToken = id => {
    return jwt.sign({ id: id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true,                    // cannot be accessed or modified in any way by the browser.
        // secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
    };
    
    res.cookie('jwt', token, cookieOptions);  

    user.password = undefined;

    // res.status(statusCode).json({
    //     status: 'success',
    //     token,
    //     data: {
    //         user
    //     }
    // })

    // res.render('viewUser', {token});
    // console('redered')
}

exports.signup = async (req, res, next) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        const passwordConfirm = req.body.passwordConfirm;

        const user = await User.findOne({ email: req.body.email });
        if(user) {
            return res.status(400).json({
                status: 'fail',
                message: 'Email already exists'
            })
        }

        const newUser = await User.create({
            name,
            email,
            password,
            passwordConfirm
        });

        res.redirect('/');
        // createSendToken(newUser, 201, res);
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

exports.login = async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        if(!email || !password) {
            return res.status(400).json({
                status: 'fail',
                message: 'Please provide email and password'
            })
        }
        const user = await User.findOne( { email: email } );

        if(!user || !(user.isCorrectPassword(password, user.password))) {
            return res.status(401).json({
                status: 'fail',
                message: 'Incorrect email or password'
            })
        }

        const userObj = user.toObject();    
        createSendToken(user, 200, res);
        if(user.role === 'user')
            res.redirect('/home');
        else {
            // const users = await User.find().lean();    
            res.redirect('/admin');
            // res.render('viewAdmin', { userObj, users });
        }


    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: {
                err
            }
        })
    }
}

exports.admin = async (req, res, next) => {
    const userObj = req.user.toObject();
    const users = await User.find().lean();    
    res.render('viewAdmin', { userObj, users });
}


exports.home = (req, res, next) => {
    const userObj = req.user.toObject();
    res.render('viewUser', { userObj });
    // res.render('test');
}

exports.login1 = (req, res, next) => {
    res.render('login');
}

exports.myAccount = (req, res, next) => {
    // console.log(req.user);
    const user = req.user.toObject();
    res.render('MyAccount', { user });
}

exports.account = (req, res, next) => {
    // console.log(req.user);
    const user = req.user.toObject();
    res.render('account', { user });
}

exports.adminAccount = (req, res, next) => {
    console.log(req.user);
    const user = req.user.toObject();
    res.render('adminAccount', { user });
}

exports.myHistory = (req, res, next) => {
    // console.log(req.user);
    const user = req.user.toObject();
    res.render('myHistory', { user });
}

exports.history = (req, res, next) => {
    // console.log(req.user);
    const user = req.user.toObject();
    res.render('history', { user });
}

exports.protect = async (req, res, next) => {
    // 1) Getting token and check of it's there
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    else if(req.cookies.jwt){
        token = req.cookies.jwt;
    }
    if(!token) {
        return res.status(401).json({
            status: 'fail',
            message: 'You are not logged in! Please log in to get access.'
        })
    }
    // 2) Verification token
    const decoded = await util.promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) check if user still exist
    const currentUser = await User.findById(decoded.id);
    if(!currentUser) {
        return res.status(401).json({
            status: 'fail',
            message: 'The user belonging to this token does no longer exist'
        })
    }

    // 4) check if user changed password after the token was issued
    // if(currentUser.isChangedPasswordAfter(decoded.iat)) {
    //     return next(new AppError('User recently changed password. Please login again', 401));
    // };


    req.user = currentUser;
    next();
};

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            return res.status(403).json({
                status: 'fail',
                message: 'You do not have permission to perform this action'
            })
        }
        next();
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        const id = req.body.id;
        const name = req.body.name;
        const email = req.body.email;

        const user = await User.findByIdAndUpdate(id , { 
            name,
            email
        }, {
            new: true,
            runValidators: true
        });

        res.redirect('/admin');
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: {
                err
            }
        })
    }
}

exports.createAccount = async (req, res, next) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const role = req.body.role;
        const password = req.body.password;
        const passwordConfirm = req.body.passwordConfirm;

        const user = await User.findOne({ email });
        if(user) {
            return res.status(400).json({
                status: 'fail',
                message: 'Email already exists'
            })
        }

        const newUser = await User.create({
            name,
            email,
            role,
            password,
            passwordConfirm
        });
        // console.log(name, email, role, password, passwordConfirm);
        res.redirect('/admin');
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: {
                err
            }
        })
    }
}

exports.deleteAccount = async (req, res, next) => {
    try {
        const id = req.body.id;

        await User.findByIdAndDelete(id);

        res.redirect('/admin');
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: {
                err
            }
        })
    }
}

exports.changeUserPassword = async (req, res, next) => {
    try {
        const id = req.body.id;
        const password = req.body.password;
        const passwordConfirm = req.body.passwordConfirm;

        const user = await User.findById(id);

        user.password = password;
        user.passwordConfirm = passwordConfirm;
        await user.save();

        res.redirect('/admin');
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: {
                err
            }
        })
    }
}

exports.test = (req, res, next) => {
    res.send('abc');
}
