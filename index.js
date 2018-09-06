import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import routes from './routes/routes';

const option = {
  server: {
    socketOptions: {
      keepAlive: 300000,
      connectTimeoutMS: 30000
    }
  },
  replset: {
    socketOptions: {
      keepAlive: 300000,
      connectTimeoutMS: 30000
    }
  }
};

dotenv.config();
// database config
const configDB = require('./config/db');

if (process.env.NODE_ENV === 'production') {
  mongoose.connect(configDB.url_production, option); // connect to our production database
} else if (process.env.NODE_ENV === 'test') {
  mongoose.connect(configDB.url_test); // connect to our test database
} else {
  mongoose.createConnection(configDB.url);
}

mongoose.connect(configDB.url);
const port = parseInt(process.env.PORT, 10) || 8000;

// Set up the express app
const app = express();
// Log requests to the console.
// app.use(logger('dev'));

// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api/v1', routes);


// Setup a default catch-all route that sends back a welcome message in JSON format.
app.get('*', (req, res) => res.status(200).send({
  message: 'Welcome to the beginning of nothingness.',
}));

app.listen(port, (err) => {
  if (err) {
    return {
      error: err,
      message: 'but stuff works'
    };
  }
  console.log(`Server runnin on port ${port}...`);
});

export default app;
