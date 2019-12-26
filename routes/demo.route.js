const express = require('express');
const multer = require('multer')

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  },
  destination: function (req, file, cb) {
    cb(null, `./public/imgs/`);
  },
});
const upload = multer({ storage });

const router = express.Router();

router.get('/editor', function (req, res) {
  res.render('vwDemo/editor');
})

router.post('/editor', function (req, res) {
  console.log(req.body.FullDes);
  res.send('done')
})

router.get('/upload', function (req, res) {
  res.render('vwDemo/upload');
})

router.post('/upload', function (req, res) {
  upload.single('fuMain')(req, res, err => {
    if (err) { }

    res.send('ok');
  });
})

module.exports = router;