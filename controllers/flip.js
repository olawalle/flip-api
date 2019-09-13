import mongoose from 'mongoose';
import Flip from '../models/Flip';

mongoose.Promise = global.Promise;

export default {
  async addFlip(req, res) {
    const {
        title,
        text,
        paid,
        banner,
        subject,
        description,
        longDesc,
        level
    } = req.body
    try {
      const flip = new Flip({
        title,
        text,
        paid,
        banner,
        subject,
        description,
        longDesc,
        level
      });
      const newFlip = await flip.save();
      return res.status(201).send({
        success: true,
        message: `Flip ${newFlip.title} succesfully added; `
      });
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: 'Server Error ',
        error
      });
    }
  }
};
