import mongoose from "mongoose";
import Topic from "../models/Topic";

mongoose.Promise = global.Promise;

export default {
  createTopic(req, res) {
    const { className, title, access, video, subject, status, article } = req.body;

    const topic = new Topic({
      author: req.decoded.name,
      class: className,
      subject,
      title,
      isFree: access === 'free' ? true : false,
      'video.title': video && video.title ? video.title : null,
      'video.url': video && video.url ? video.url : null,
      'article.title': article && article.title ? article.title : null,
      'article.content': article && article.content ? article.content : null,
      isPublished: status === 'publish' ? true : false
    });
    topic.save().then((newTopic) => {
      return res.status(201).send({
        success: true,
        message: `Topic ${newTopic.title} succesfully added to class${newSubject.className}; `
      })
    })
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
      })
    }
    catch(error) {
      return res.status(500).send({
        success: false,
        error
      })
    }
  },

  async getSubjectDetails(req, res) {

  }
};
