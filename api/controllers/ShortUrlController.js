/**
 * ShortUrlController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

 module.exports = {
     createShort: async function (req, res){
         var currtitle = req.body.title;
         var currlongUrl = req.body.url;
         var currshort = req.body.short;

         if(req.body.short==""){
            const shortid = require('shortid');
            req.body.short = shortid.generate();
         } else {
            var existUrl = await ShortUrl.findOne({'short':req.body.short});

            if(existUrl) return res.view('link/createLinkFail', {title: currtitle, longUrl: currlongUrl, short: currshort});
         }

         var user = await User.findOne(req.session.idd).populate("shortened");

         var dLinkExist = false;
         var targetUrl;

         user.shortened.forEach(function(shortUrl) {
            if(shortUrl.url==currlongUrl){
               dLinkExist = true;
               targetUrl = shortUrl;
            }
        });

         if(req.body.title==""){
            req.body.title = req.body.url;
            currtitle = req.body.url;
        }

         if(dLinkExist){
            return res.view('link/replaceLink', {thatUrl: targetUrl, title: currtitle, longUrl: currlongUrl, short: req.body.short})
         }



         var urlRecord = await ShortUrl.create(req.body).fetch();
         await User.addToCollection(req.session.idd, "shortened").members(urlRecord.id);

         return res.json(user);
     },

     createLink: async function(req, res){
        if (req.method == "GET") return res.view('link/createLink');
     }, 



};
