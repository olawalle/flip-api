import jwt from 'jsonwebtoken';

const jwtVerify = {
  /**
   * @method hasToken
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns {*} response
   */
  hasToken(req, res, next) {
    const token = req.body.token || req.headers['x-access-token'];
    if (token) {
      jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) {
          return res.status(403).send(err);
        }
        req.decoded = decoded;
        return next();
      });
    } else {
      res.status(403).send({
        message: 'You have to be loggedin first'
      });
    }
  }
};
export default jwtVerify;
