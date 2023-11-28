const User = require('../models/userModel');
const History = require('../models/uploadHistoryModel');
const { spawn } = require('child_process');

const multer = require('multer');
const app = require('../app');

exports.getAllUsers = async (req, res, next) => {
    const users = await User.find();
    if (!users) {
        return res.status(404).json({
            status: 'fail'
        })
    }

    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users
        }
    })
}

exports.getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).populate('uploads')
        if (!user) {
            return res.status(404).json({
                status: 'fail',
                message: 'can not find user with that Id'
            })
        }

        return res.status(200).json({
            status: 'success',
            data: {
                user
            }
        })

    } catch (err) {
        return res.status(400).json({
            status: 'fail',
            error: err
        })
    }
}

exports.updateUser = async (req, res, next) => {
    try {
        const user = await User.findOneAndUpdate({ email: req.body.email }, { name: req.body.name }, {
            new: true,
            runValidators: true
        });

        if (!user) {
            return res.status(404).json({
                status: 'fail',
                message: 'No user found with that ID'
            })
        }
        if (req.user.role === 'user')
            res.redirect('/myAccount');
        else
            res.redirect('/admin/myAccount');



    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }

};

exports.updatePassword = async (req, res, next) => {
    try {
        const currentPassword = req.body.currentPassword;
        const newPassword = req.body.newPassword;
        const confirmPassword = req.body.confirmPassword;
        const user = req.user;

        if (!(user.isCorrectPassword(currentPassword, user.password))) {
            return res.status(401).json({
                status: 'fail',
                message: 'Incorrect password'
            })
        }

        user.password = newPassword;
        user.passwordConfirm = confirmPassword;
        await user.save();

        if (req.user.role === 'user')
            res.redirect('/myAccount');
        else
            res.redirect('/admin/myAccount');
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}
exports.getHistory = async (req, res, next) => {
    try {
        const record = await History.find({ user: req.user.id }).lean();
    
        if (!record) {
          return res.status(404).json({ message: 'Không tìm thấy bản ghi.' });
        }
    
        const userObj = req.user.toObject();

        res.render('history', { userObj, record });
      } catch (error) {
        res.status(500).json({ message: 'Lỗi server.' });
      }
}
exports.getAllHistory = async (req, res, next) => {
    try {
        const records = await History.find().lean();

        // Nhóm bản ghi theo ngày và tính người dùng đã chuyển đổi
        const groupedData = {};
        records.forEach((record) => {
            const date = record.createdAt; // Trích xuất ngày
            if (!groupedData[date]) {
                groupedData[date] = {
                    date,
                    convertedUsers: 0,
                    data: [],
                };
            }
            groupedData[date].convertedUsers++;
            groupedData[date].data.push(record);
        });

        // Chuyển đổi dữ liệu đã nhóm thành một mảng
        const historyData = Object.values(groupedData);

        const userObj = req.user.toObject();

        res.render('histroy_admin', { userObj, historyData });
        // res.status(200).json(historyData)
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err,
        });
    }
};
