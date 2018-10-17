import mongoose from 'mongoose';
import Topic from '../models/Topic';
import Subject from '../models/Subjects';

mongoose.Promise = global.Promise;

export default {
  async createTopic(req, res) {
    const {
 className, title, access, video, subject, status, article 
} = req.body;

    try {
      const topic = new Topic({
        author: req.decoded.name,
        class: className,
        subject,
        title,
        isFree: access === 'free',
        'video.title': video && video.title ? video.title : null,
        'video.url': video && video.url ? video.url : null,
        'article.title': article && article.title ? article.title : null,
        'article.content': article && article.content ? article.content : null,
        isPublished: status === 'publish'
      });
      const newTopic = await topic.save();
      const subject = await Subject.findOneAndUpdate({
        name: newTopic.subject,
        class: newTopic.class
      }, {
        $push: { topic: newTopic }
      }).exec();
      return res.status(201).send({
        success: true,
        message: `Topic ${newTopic.title} for ${subject.name} succesfully added to class${subject.class}; `
      });
    } catch (error) {
      return res.stat;
    }
  },

  async getBySubject(req, res) {
    const { subject } = req.params;
    try {
      const promise = Topic.find({
        subject
      });
      const topics = await promise;
      return res.status(200).send({
        success: true,
        topics
      });
    } catch (error) {
      return res.status(500).send({
        success: false,
        error
      });
    }
  },

  // async getOneTopic(req, res) {
  //   const { id } = req.params;
  //   try {

  //   }
  // }
};
