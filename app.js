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

const productModel = require('./models/product.model');
const moment = require('moment');

app.get('/', async (req, res) => {
  // res.end('hello from expressjs');
  if (req.session.task !== 1) {
    cron.schedule('*/30 * * * *', async () => {
      temp = await productModel.all();
      // var now = new Date;
      var now = new Date();
      //console.log(now.valueOf());
      for (i = 0; i < temp.length; i++) {
        var expired = new Date(temp[i].expired_at);
        var created = new Date(temp[i].created_at);
        var newTime = now - created;
        if (now >= expired && temp[i].id_bidder != 0) {
          temp[i].p_status = 2;
          var entity = {
            p_status: temp[i].p_status,
            ProID: temp[i].id
          };
          await productModel.patch(entity);
        }
        else {
          if (now >= expired && temp[i].id_bidder == 0) {
            temp[i].p_status = 0;
            var entity = {
              p_status: temp[i].p_status,
              id: temp[i].id
            };
            await productModel.patch(entity);
          }
          //console.log("còn hạn");
        }

        if (newTime > 43200000)//thời gian thêm vào đã qua 12h = 43200000
        {
          var entity = {
            is_new: 0,
            ProID: temp[i].id
          };
          await productModel.patch(entity);
        }
        //console.log(newTime.valueOf())
      }

      //console.log(temp);
      console.log('running a task every 30 seconds');
    });
    req.session.task = 1;
    //console.log('fafefsdsa');
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