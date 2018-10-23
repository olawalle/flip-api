import multer from 'multer';
import dotenv from 'dotenv';
import multerS3 from 'multer-s3';
import AWS from 'aws-sdk';
import TextBook from '../models/TextBooks';

dotenv.config();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});
const spacesEndpoint = new AWS.Endpoint('nyc3.digitaloceanspaces.com');
const s3 = new AWS.S3({
  endpoint: spacesEndpoint
});
const upload = multer({
  storage: multerS3({
    s3,
    bucket: 'bookly-files',
    acl: 'public-read',
    metadata(req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key(req, file, cb) {
      cb(null, file.originalname);
    }
  })
});
export default {
  handleFileUpload(req, res) {
    const {
      title, subject, author, thumbnailUrl, isPublished, isFree, className
    } = req.body;
    const singleUpload = upload.single('book');
    singleUpload(req, res, async (error) => {
      try {
        if (error) {
          return res.status(500).send({
            success: false,
            message: 'Internal Server Error'
          });
        }
        const textBook = new TextBook({
          title,
          subject,
          author,
          isPublished: !!(isPublished === true || 'true'),
          isFree: !!(isFree === true || 'true'),
          thumbnailUrl,
          class: className,
          url: req.file.location
        });
        const newTextBook = await textBook.save();
        res.status(201).send({
          success: true,
          message: 'Book successfuly uploaded',
          bookUrl: req.file.location,
          newTextBook
        });
      } catch (err) {
        return res.status(500).send({
          success: false,
          message: 'Internal Server Error',
          err
        });
      }
    });
  },

  async getBookById(req, res) {
    const { id } = req.params;
    try {
      const book = await TextBook.findById(id).exec();
      if (book) {
        return res.status(200).send({
          success: true,
          book
        });
      }
      return res.status(404).send({
        success: false,
        message: 'Book not found'
      });
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: 'Internal Server Error',
        error
      });
    }
  },

  async getAllBooksByClass(req, res) {
    const className = req.params.class;
    try {
      const books = await TextBook.find({
        class: className
      }).exec();
      if (books) {
        return res.status(200).send({
          success: true,
          books
        });
      }
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: 'Internal Server Error',
        error
      });
    }
  },

  async getAllBooksBySubject(req, res) {
    const { subject } = req.params;
    try {
      const books = await TextBook.find({
        subject
      }).exec();
      if (books) {
        return res.status(200).send({
          success: true,
          books
        });
      }
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: 'Internal Server Error',
        error
      });
    }
  }
};
