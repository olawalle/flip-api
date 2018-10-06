import mongoose from 'mongoose';
import multer from 'multer';
import multerS3 from 'multer-s3';
import AWS from 'aws-sdk';

export default {
  handleFileUpload(req) {
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY  
    })
    const spacesEndpoint = new AWS.Endpoint('nyc3.digitaloceanspaces.com');
    const s3 = new aws.S3({
      endpoint: spacesEndpoint
    });
    const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: 'bookly-files',
      acl: 'public-read',
      key: function (request, file, cb) {
        console.log(file);
        cb(null, file.originalname);
      }
    })
  }).array('upload', 1);
  return upload
  },

  uploadBook(req, res) {
    const { title, subject, className, author, access, status } = req.body;
  }
  
}
