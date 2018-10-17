import mongoose from 'mongoose';
import multer from 'multer';
import multerS3 from 'multer-s3';
import AWS from 'aws-sdk';

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});
const spacesEndpoint = new AWS.Endpoint('nyc3.digitaloceanspaces.com');
const s3 = new AWS.S3({
  endpoint: spacesEndpoint
});
export default {
  handleFileUpload(req, res) {
    multer({
      storage: multerS3({
        s3,
        bucket: 'bookly-files',
        acl: 'public-read',
        key(req, file, cb) {
          cb(null, file.originalname);
        }
      })
    }).array('upload', 1);
  },

  uploadBook(req, res) {
    const {
      title, subject, className, author, access, status
    } = req.body;
  }

};
