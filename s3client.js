require('dotenv').config();
const fs = require('fs');
const S3 = require('aws-sdk/clients/s3');
const bucketName = process.env.AWS_BUCKET_NAME;
const access_key = process.env.AWS_ACCESS_KEY_ID;
const secret_key = process.env.AWS_SECRET_ACCESS_KEY;
const region = process.env.AWS_BUCKET_REGION;

const s3 = new S3({
  region,
  accessKeyId: access_key,
  secretAccessKey: secret_key
});

function uploadFile(file) {
  const fileStream = fs.createReadStream(file.path);

  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename
  }

  return s3.upload(uploadParams).promise()
}
exports.uploadFile = uploadFile;

function getFileStream(fileKey) {
  const downloadParams = {
    "Key": fileKey,
    "Bucket": bucketName
  };
  return s3.getObject(downloadParams).createReadStream();
}
exports.getFileStream = getFileStream;
