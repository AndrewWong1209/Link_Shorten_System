/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  //'/': { view: '/user/createCompleted' },


  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/
   'GET /': 'UserController.login',
   'GET /user': 'UserController.login',
   'GET /user/login': 'UserController.login',
   'POST /user/login': 'UserController.login',
   'POST /user/logout': 'UserController.logout',

   'GET /user/:id/list': 'UserController.populate',
   'GET /user/:id/list/:fk': 'UserController.read',

   'GET /link/createLink': 'ShortUrlController.createLink',
   'POST /shorturls': 'ShortUrlController.createShort',

   'GET /link/createCompleted': 'UserController.createCompleted',

   'GET /:shortId': 'shorturl/get-shorturl',

   
   'POST /link/update/:fk': 'UserController.update',
   'POST /link/replace/:fk': 'UserController.replace',

   'POST /link/delete/:fk': 'UserController.delete',

   'GET /user/addUserPage': 'UserController.addUserPage',
   'POST /user/addUser': 'UserController.addUser',

   'GET /user/listUser': 'UserController.listUser',

   'GET /user/editUser/:fk': 'UserController.editUser',
   'POST /user/editUser/:fk': 'UserController.editUser',
   'POST /user/deleteUser/:fk': 'UserController.deleteUser',
};
