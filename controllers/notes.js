import mongoose from 'mongoose';
import Note from '../models/Notes';
import User from '../models/User';

mongoose.Promise = global.Promise;

export default {
  async createNote(req, res) {
    const { title, content } = req.body;
    const { topicId } = req.query;
    try {
      const subject = new Note({
        title,
        content,
        authorId: req.decoded.id,
        topicId
      });
      const newNote = await subject.save();
      User.findByIdAndUpdate(newNote.authorId, {
        $push: { notes: newNote }
      });
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
      const promise = Note.find({ authorId: req.decoded.id }).exec();
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

  async getNoteByTopic(req, res) {
    try {
      const promise = Note.find({
        topicId: req.params.topicId,
        authorId: req.decoded.id
      }).exec();
      const notes = await promise;
      if (notes) {
        return res.status(200).send({
          success: true,
          notes
        });
      }
      return res.status(404).send({
        success: false,
        message: 'Topic not found'
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
