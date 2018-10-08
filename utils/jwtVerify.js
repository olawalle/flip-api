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
  },
  async isAdmin (req, res, next) {
    try {
      const promise = User.findById(req.decoded.id).exec();
      const user = await promise;
      if (user) {
        if (user.isAdmin) {
          return next();
        }
        return res.status(403).send({
          success: false,
          message: 'You are not authoried to access this page'
        })
      }
      return res.status(404).send({
        success: false,
        message: 'User does not exist'
      })
    }
    catch(error) {
      res.status(500).send({
        success: false,
        message: 'Server Error',
        error
      })
    }
  }
};
export default jwtVerify;
