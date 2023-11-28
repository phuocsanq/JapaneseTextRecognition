const path = require('path');
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const handlebars = require('express-handlebars').engine;
const bodyParser = require('body-parser');

// const multer = require('multer');

const { spawn } = require('child_process');


const userRouter = require('./routes/userRoutes');
const uploadRouter = require('./routes/uploadRoutes');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan('dev'));
app.engine(
  'hbs',
  handlebars({
      extname: '.hbs',
      helpers: {
        sum: (a, b) => a + b,
    }
  }),
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

// Body parser, reading data from body into req.body
app.use(express.json());
app.use(cookieParser());


// app.use(cors());

// app.use((req, res, next) =>{
//   // console.log(req.cookies);
//   next();
// })

// app.use(cors({
//     origin: 'http://127.0.0.1:5500',
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     credentials: true, // Cho phép sử dụng cookies hoặc các thông tin xác thực
//   }));

// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
//     next();
//   });

// /////////////////////////////////////////////////////////////////////
//   // Thiết lập Multer cho việc tải lên tệp
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/'); // Đặt thư mục tải lên
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
//   },
// });


// const upload = multer({ storage });

// // Phục vụ tệp tĩnh từ thư mục 'public' (ví dụ: HTML, CSS, JavaScript)
// app.use(express.static('public'));

// // Xác định một tuyến đường để xử lý việc tải lên tệp
// app.post('/file-upload', upload.array('file', 5), (req, res) => {
//   // Dạng tệp đã tải lên nằm trong req.files
//   const uploadedFiles = req.files;
//   // console.log(req.files[0].filename);
//   if (!uploadedFiles || uploadedFiles.length === 0) {
//     return res.status(400).json({ message: 'No files uploaded.' });
//   }

//   // Xử lý tệp đã tải lên ở đây (ví dụ: lưu vào cơ sở dữ liệu, xử lý, vv.)
//   // Phản hồi thành công
//   res.status(200).json({ message: 'Files uploaded successfully.' });
// });

// Route
app.use('/', userRouter);

app.use('/api/v1/users', userRouter);
app.use('/api/v1/upload', uploadRouter);

module.exports = app;

