'use strict'
let config = {};

config.mongoURI = {
  development: "mongodb://app:app@ds062059.mlab.com:62059/database-nodecourse",
  test: "mongodb://app:app@ds062059.mlab.com:62059/database-nodecourse-test"
}

module.exports = config;
