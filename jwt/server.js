const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // import thư viện uuid
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv');
app.use(cookieParser());



dotenv.config();
// mongodb://127.0.0.1:27017
// Kết nối tới MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/Mydata', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to MongoDB");
});

// Tạo schema cho người dùng
const userSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4().substr(0, 6) }, // tạo _id với 6 chữ số ngẫu nhiên
  username: String,
  email: String,
  password: String,
  role: { type: String, default: 'user' }
}, { 
  collection: 'user',
});

const User = mongoose.model('User', userSchema);
// Trang chủ
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});


app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

// Đăng ký
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Kiểm tra xem email đã tồn tại trong MongoDB chưa
  const existingUser = await User.findOne({ email: email });
  if (existingUser) {
    return res.status(409).send('Email already exists');
  }
  // Kiểm tra xem username đã tồn tại trong MongoDB chưa
  const existingUsername = await User.findOne({ username: username });
  if (existingUsername) {
    return res.status(409).send('Username already exists');
  }

  // Mã hóa password bằng bcrypt
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Tạo một người dùng mới và lưu vào MongoDB
  const user = new User({
    username: username,
    email: email,
    password: hashedPassword
  });

  try {
    await user.save();
    res.status(201).send('User created and ID :' + user._id);
  } catch (err) {
    res.status(500).send(err);
  }
});

//check quyền Admin
const checkRole = (req, res, next) => {
  if (req.user.role === 'admin') {
    return res.redirect('/admin');
  }
  next();
};


// Thiết lập kết nối giao diện với đăng nhập
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Đăng nhập
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Tìm kiếm người dùng trong MongoDB bằng username
  const user = await User.findOne({ username: username });
  if (!user) {
    return res.status(401).send('Username or password is incorrect');
  }

  // So sánh password được cung cấp với password đã mã hóa trong MongoDB
  const validPassword = await bcrypt.compare(password, user.password);
  if (validPassword) {
    
    
    //tạo cho user một token  khi đăng nhập thành công
    const token = jwt.sign({_id:user.id}, process.env.SECRET, {expiresIn:'24h'});
    
    res.cookie("token",token,{
      httpOnly: true,
    });
  }else{

    return res.status(401).send('Username or password is incorrect');
  }  

  // Kiểm tra quyền của người dùng
  const role = user.role;
  if (role === 'admin') {
    res.redirect('/admin');
  } else {
    res.status(200).send('Logged in');
  }
});

// Kiểm tra xem token trong cookie có hợp lệ không
var checkToken = (req, res, next)=> {
  try{
      var token = req.cookies.token;
      var iduser = jwt.verify(token, process.env.SECRET);
      User.findOne({
        _id: iduser
      })
      .then(data=>{
        if(data){
          req.data = data
          next()
        }else{
          res.json('Not PERMISSON')
        }
      })
  }catch(err){
    res.status(500).send('Invalid Token');
  }
}


app.use(bodyParser.urlencoded({ extended: true }));
//thay đôi mật khẩu

app.get('/changepassword',checkToken,(req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'changepassword.html'));
});

app.post('/changepassword',checkToken,async (req, res) => {
	const { username, oldpassword, newpassword } = req.body;
	// Find user in MongoDB
	const user = await User.findOne({username });
	if (!user) {
		return res.send('User or password is incorrect');
	}

	// Check if old password is correct
	if (!await bcrypt.compare(oldpassword, user.password)) {
		return res.send('User or password is incorrect');
	}

	// Hash new password
	const hashedPassword = await bcrypt.hash(newpassword, 10);

	// Update user password in MongoDB
	await User.updateOne({ username }, { password: hashedPassword });

	res.send('Password updated successfully');
});

//đăng xuất

app.get('/logout', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});
app.post('/logout', (req, res) => {
  // Xóa session của người dùng
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/');
    }
  });
});

//vào trang chủ admin
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'admin.html'));
});

// Xử lý mã admin
app.post('/Admin1', (req, res) => {
  const code = req.body.code;
  if (code === '08022002') {
    res.sendFile(path.join(__dirname, 'views', 'Admin1.html'));
  } else {
    res.send('Mã đăng nhập không chính xác');
  }
});




// Thiết lập middleware để xử lý dữ liệu gửi từ form
app.use(express.urlencoded({ extended: true }));
//giao diện xóa
app.get('/Admin/delete', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'delete.html'));
});

// Xử lý yêu cầu xóa tài khoản người dùng
app.post('/Admin/delete', async (req, res) => {
  const { username} = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      res.send('Username sai');
      return;
    }
    //kiem tra tài khoải bị xóa là role user
    if (user.role !== 'user') {
        res.redirect('/');
      return;
    }

    const result = await User.deleteOne({ username });
    if (result.deletedCount === 1) {
      res.send(`Xóa thành công tài khoản người dùng: ${user.username} (Email: ${user.email})`);
    } else {
      res.send('Lỗi server');
    }
  } catch (err) {
    console.error(err);
    res.send('Lỗi server');
  }
});
//Tìm kiếm user qua Id
app.get('/Admin/viewUser', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'viewUser.html'));
});

app.post('/Admin/viewUser', async (req, res) => {
  const { _id } = req.body;

  try {
    const user = await User.findOne({ _id });
    if (!user) {
      res.send('ID sai');
      return;
    }
    //kiem tra tài khoải bị xóa là role user
    if (user.role !== 'user') {
        res.redirect('/');
      return;
    }
    res.send(`Username: ${user.username} (Email: ${user.email})`);
  } catch (err) {
    console.error(err);
    res.send('Lỗi server');
  }
});

//xem toàn bộ databse
app.get('/Admin/viewAllUsers', (req, res)=>{
  User.find({})
  .then(data=>{
      res.atatus(300).json(data)
  })
  .catch(err=>{
      res.status(500).json('Lỗi sever')
  })
})
// Khởi động server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
