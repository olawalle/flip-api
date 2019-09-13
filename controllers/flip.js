import mongoose from 'mongoose';
import Flip from '../models/Flip';
import Subject from '../models/Subjects';

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
  },

  async getFlips(req, res) {
    const subjects = await Subject.find()
    Flip.find().exec()
    .then(flips => {
      let resp = []
      subjects.forEach((subject, i) => {
        resp[i] = {
          subject: subject.name,
          flips: []
        }
      })

      flips.forEach((flip) => {
        let foundIndex = null
        resp.find((subject, j) => {
          subject.subject === flip.subject ? foundIndex = j : foundIndex = null
          return subject.subject === flip.subject
        }) && resp[foundIndex].flips.push(flip)
      })
      
      res.status(200).send({ flips: resp })
    })
    .catch(err => {
      res.status(400).send({err})
    })
  },

  async searchFlips(req, res) {
    let query = req.body.query.toLowerCase()
    Flip.find().exec()
    .then(flips => {
      let searchResults = flips.filter((flip) => {
        return flip.title.toLowerCase().includes(query) ||
        flip.text.toLowerCase().includes(query) ||
        flip.subject.toLowerCase().includes(query) ||
        flip.description.toLowerCase().includes(query) ||
        flip.longDesc.toLowerCase().includes(query)
      })
      res.status(200).send({
        message: 'Search results',
        searchResults
      })
    })
    .catch(err => {
      res.status(400).send({err})
    })
  }

};
