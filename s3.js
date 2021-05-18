const express = require('express');
const router = express.Router();
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const fs = require('fs');
const util = require('util');
const unlinkFile = util.promisify(fs.unlink);
const { uploadFile, getFileStream } = require('./s3client');

router.get('/:key', (req, res)=>{
  const key = req.params.key;
  const readStream = getFileStream(key);
  readStream.pipe(res);
});

router.post('/', upload.single('file'), async (req, res) => {
  const file = req.file; // file.path. file.filename. file.originalname important
  const result = await uploadFile(file);
  // console.log(file);
  await unlinkFile(file.destination + file.filename); // should be file.path, but it didn't work 
  res.send({imagePath: `/api/s3/${result.Key}`});
});

router.post('/avatar', upload.single('image'), async (req, res) => {
  const file = req.file; // file.path. file.filename. file.originalname important
  const result = await uploadFile(file);
  // console.log(file);
  await unlinkFile(file.destination + file.filename); // should be file.path, but it didn't work 
  res.send({imagePath: `/api/s3/${result.Key}`});
});
module.exports = router;