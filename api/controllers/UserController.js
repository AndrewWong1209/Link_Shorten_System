/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    login: async function (req, res) {

        if (req.method == "GET") return res.view('user/login', {layout: false});
    
        if (!req.body.username || !req.body.password) return res.badRequest();
    
        var user = await User.findOne({ username: req.body.username });
    
        if (!user) return res.status(401).json("User not found");
    
        if (user.password != req.body.password) 
            return res.status(401).json("Wrong Password");
        
        // Start a new session for the new login user
        req.session.regenerate(function (err) {
    
            if (err) return res.serverError(err);
    
            req.session.username = user.username; 
            req.session.idd = user.id
            
            console.log(user)
            return res.json(user);
        });
    },

    logout: async function (req, res) {

        req.session.destroy(function (err) {
        
            if (err) return res.serverError(err);
        
            return res.view('user/login', {layout: false}); 
        });
    },

    populate: async function (req, res) {

        var user = await User.findOne(req.params.id).populate("shortened");
    
        if (!user) return res.notFound();

        var count = 0;
        const arr = [];

        user.shortened.forEach(function(shortUrl) {
            count = count + 1;
            arr.push(shortUrl.id);
        });

        if(count == 0){
            return res.view('user/list', {thatUser: user});
        }

        var targetUrl = await ShortUrl.findOne(arr[0]).populate("master", {id: req.session.idd});
        if(!targetUrl) return res.status(404).json("Link not found");
        return res.view('user/read', {thatUrl: targetUrl, thatUser: user})
        
    },

    createCompleted: async function (req, res){
        if (req.method == "GET") return res.view('link/createCompleted');
    },

    read: async function (req, res){
        if(req.method="GET"){
            var user = await User.findOne(req.params.id).populate("shortened");
            
            if(!user) return res.notFound();

            var targetUrl = await ShortUrl.findOne(req.params.fk).populate("master", {id: req.session.idd});
            if(!targetUrl) return res.status(404).json("Link not found");
            return res.view('user/read', {thatUrl: targetUrl, thatUser: user})
        }
    },

    update: async function (req, res){
        var user = await User.findOne(req.session.idd).populate("shortened");
        if(req.method="POST"){
            if(req.body.oldShort != req.body.short){
                var existShort = await ShortUrl.findOne({'short':req.body.short});

                if(existShort) {
                    var targetUrl = await ShortUrl.findOne(req.params.fk).populate("master", {id: req.session.idd});
                    return res.view('user/editLinkFail', {thatUrl: targetUrl, inputUrl: req.body, thatUser: user});
                } 
            }

            if(req.body.title==""){
                req.body.title = req.body.url;
            }
            if(req.body.short==""){
                const shortid = require('shortid');
                req.body.short = shortid.generate();
            }




            if(req.body.oldUrl!=req.body.url){
                 

                 var dLinkExist = false;
                 var targetUrl;
       
                 user.shortened.forEach(function(shortUrl) {
                    if(shortUrl.url==req.body.url){
                       dLinkExist = true;
                       targetUrl = shortUrl;
                    }
                });

                if(dLinkExist){
                    return res.view('link/replaceLink', {thatUrl: targetUrl, title: req.body.title, longUrl: req.body.url, short: req.body.short, id:req.body.id})
                 }
             }


            var updatedUrl = await ShortUrl.updateOne(req.params.fk).set(req.body);
            if(!updatedUrl) return res.notFound();

            return res.json(user);
        }
    }, 

    replace: async function(req, res){
        var updatedUrl = await ShortUrl.updateOne(req.params.fk).set(req.body);
        if(!updatedUrl) return res.notFound();

        var str = 'http://localhost:1337/user/'+req.session.idd+'/list'

        return res.redirect(str);
    },

    delete: async function (req, res){
        var user = await User.findOne(req.session.idd).populate("shortened");

        if(req.method="POST"){

            var deletedUrl = await ShortUrl.destroyOne(req.params.fk);

            if(!deletedUrl) return res.notFound();

            return res.json(user);
        }
    },

    addUserPage: async function(req,res){
        if(req.method="GET"){
            return res.view('user/addUser')
        }
    },

    addUser: async function(req, res){
        if(req.method="POST"){
            await User.createEach([
                { username: req.body.username , password: req.body.password }
              ]);
            
              var str = 'http://localhost:1337/user/listUser'

              return res.redirect(str);
        }
    },

    listUser: async function(req, res){
        if(req.method=="GET"){
            var everyUser = await User.find().sort('createdAt');
            return res.view('user/listUser', {users: everyUser});
        }
    },

    editUser: async function(req,res){
        if(req.method=="GET"){
            var user = await User.findOne(req.params.fk);
            if(!user) return res.notFound();
            return res.view('user/editUser', {thatUser:user});
        }

        if(req.method=="POST"){
            var updatedUser = await User.updateOne(req.params.fk).set(req.body);
            if(!updatedUser) return res.notFound();
            
            var str = 'http://localhost:1337/user/listUser'

            return res.redirect(str);
        }
    },

    deleteUser: async function (req, res){
        if(req.method="POST"){
            var thatUser = await User.findOne(req.params.fk).populate("shortened");

            thatUser.shortened.forEach( async function(shortUrl) {
                await ShortUrl.destroyOne(shortUrl.id)
            });
            
            var deletedUser = await User.destroyOne(req.params.fk);

            if(!deletedUser) return res.notFound();

            var str = 'http://localhost:1337/user/listUser'
            return res.redirect(str);
        }
    },


    
};



