import mongoose from 'mongoose';
import Note from '../models/Notes';

mongoose.Promise = global.Promise;

export default {
  async createNote(req, res) {
    const { title, content } = req.body;
    const { authorId, topicId } = req.params; 
    try {
      const subject = new Note({
        title,
        content,
        authorId,
        topicId
      });
      const newNote = await subject.save();
      return res.status(201).send({
        success: true,
        message: `Note ${newNote.name} succesfully added to class${newNote.class}; `
      });
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: 'Server Error ',
        error
      });
    }
  },

  async getAllNotes(req, res) {
    try {
      const promise = Note.find().exec();
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

  async getNoteByClass(req, res) {
    try {
      const promise = Note.find({
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
