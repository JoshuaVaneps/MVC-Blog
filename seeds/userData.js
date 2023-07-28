const { User } = require("../models");

const userdata = [
  {
    username: "joshuavaneps",
    email: "joshuavaneps@yahoo.com",
    password: "Ch2nch2lla!",
  },
  {
    username: "naruto",
    email: "naruto@yahoo.com",
    password: "1234",
  },
  {
    username: "itadori",
    email: "itadori@yahoo.com",
    password: "1234",
  },
  {
    username: "yusuke",
    email: "yusuke@yahoo.com",
    password: "1234",
  },
];

const seedUser = () => User.bulkCreate(userdata);

module.exports = seedUser;
