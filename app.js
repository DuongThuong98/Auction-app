const express = require('express');
const exphbs = require('express-handlebars');
const hbs_sections = require('express-handlebars-sections');
const session = require('express-session');
const morgan = require('morgan');
const numeral = require('numeral');
const cron = require('node-cron');


require('express-async-errors');

const app = express();

app.use(morgan('dev'));
//để dùng được form thì cần cái này
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));


app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  // cookie: {
  //     secure: true
  // }
}))
//dùng thư mục public như cộng cộng mới gọi hình lên được
app.use(express.static('public'));

app.engine('hbs', exphbs({
  defaultLayout: 'main.hbs',
  layoutsDir: 'views/_layouts',
  helpers: {
    section: hbs_sections(),
    format: val => numeral(val).format('0,0'),
  }
}));
app.set('view engine', 'hbs');

// app.use(require('./middlewares/locals.mdw'));

//2 dòng này là tổng hợp của mấy dòng app.use của local hay route
require('./middlewares/locals.mdw')(app);
require('./middlewares/routes.mdw')(app);

app.get('/', (req, res) => {
  // res.end('hello from expressjs');
  if (req.session.task !== 1) {
    var task = cron.schedule('* * * * *', () => {
      console.log('running a task every minute');
    });
    req.session.task = 1;
    console.log('fafefsdsa');
  }
  res.render('home');
})

app.get('/about', (req, res) => {
  res.render('about');
})

// const categoryModel = require('./models/category.model');
// app.use(async (req, res, next) => {
//   const rows = await categoryModel.allWithDetails();
//   // console.log(rows);
//   res.locals.lcCategories = rows;
//   next();
// })



// app.use('/categories', require('./routes/category.route'));
// app.use('/admin/categories', require('./routes/admin/category.route'));

app.use((req, res, next) => {
  // res.render('vwError/404');
  res.send('You\'re lost');
})


//
// default error handler
app.use((err, req, res, next) => {
  // res.render('vwError/index');
  console.error(err.stack);
  res.status(500).send('View error on console.');
})


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
})