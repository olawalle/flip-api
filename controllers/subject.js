import mongoose from 'mongoose';
import Subject from '../models/Subjects';

mongoose.Promise = global.Promise;

export default {
  async createSubject(req, res) {
    const { name, imageUrl } = req.body;

    try {
      const subject = new Subject({
        name,
        imageUrl
      });
      const newSubject = await subject.save();
      return res.status(201).send({
        success: true,
        message: `Subject ${newSubject.name} succesfully added; `
      });
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: 'Server Error ',
        error
      });
    }
  },

  async getAllSubjects(req, res) {
    try {
      const promise = Subject.find().exec();
      const subjects = await promise;
      return res.status(200).send({
        success: true,
        subjects
      });
    } catch (error) {
      return res.status(500).send({
        success: false,
        error
      });
    }
  },

  async getSubjectByClass(req, res) {
    try {
      const promise = Subject.find({
        class: req.params.class
      }).exec();
      const subjects = await promise;
      if (subjects) {
        return res.status(200).send({
          success: true,
          subjects
        });
      }
      return res.status(404).send({
        success: false,
        message: 'Class not found'
      });
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: 'Internal Server Error',
        error
      });
    }
  }
};
