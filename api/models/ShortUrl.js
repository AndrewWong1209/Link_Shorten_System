/**
 * ShortUrl.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

 module.exports = {
  attributes: {
    url: {
      type: 'string',
      description: 'URL to shorten',
      isURL: true
    },
    short: {
      type: 'string',
    },
    title: {
      type: 'string'
    },

    master: {
      collection: 'User',
      via: 'shortened'
    }
  },
  // beforeCreate: async function (shorturl, cb) {
  //   const shortid = require('shortid');
  //   shorturl.short = shortid.generate();
  //   return cb();
  // },
};

