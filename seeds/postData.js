const { Post } = require("../models");

const postdata = [
  {
    post_title: "First Post",
    post_contents: "I hope this aplication will be useful.",
    post_date: "March 30, 2018",
    post_user: 1,
  },
  {
    post_title: "Second Post",
    post_contents: "I'm gonna be hokage",
    post_date: "June 10, 2019",
    post_user: 2,
  },
  {
    post_title: "Second Post",
    post_contents: "I'm gonna be hokage",
    post_date: "June 10, 2019",
    post_user: 3,
  },
];

const seedPost = () => Post.bulkCreate(postdata);

module.exports = seedPost;
