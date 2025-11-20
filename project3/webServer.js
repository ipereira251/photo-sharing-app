/**
 * Project 3 Express server connected to MongoDB 'project3'.
 * Start with: node webServer.js
 * Client uses axios to call these endpoints.
 */

// eslint-disable-next-line import/no-extraneous-dependencies
import mongoose from "mongoose";
// eslint-disable-next-line import/no-extraneous-dependencies
import bluebird from "bluebird";
import express from "express";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { ObjectId } from "mongodb";
import session from "express-session";

import User from "./schema/user.js";
import Photo from "./schema/photo.js";
import SchemaInfo from "./schema/schemaInfo.js";

const portno = 3001; // Port number to use
const app = express();

// Enable CORS for all routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(session({
  secret: 'something', 
  resave: false, 
  saveUninitialized: false, 
  cookie: {
    maxAge: 7200000, 
    httpOnly: true, 
    secure: false
  }
}));

mongoose.Promise = bluebird;
mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1/project3", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// We have the express static module
// (http://expressjs.com/en/starter/static-files.html) do all the work for us.
app.use(express.static(__dirname));

app.use(express.json());

app.get("/", function (request, response) {
  response.send("Simple web server of files from " + __dirname);
});

/**
 * /test/info - Returns the SchemaInfo object of the database in JSON format.
 *              This is good for testing connectivity with MongoDB.
 */

app.get('/test/info', (request, response) => {
  const info = SchemaInfo; //models.schemaInfo();
  response.status(200).send(info);
  console.log(info, "trying");
});

/**
 * /test/counts - Returns an object with the counts of the different collections
 *                in JSON format.
 */
app.get('/test/counts', async (request, response) => {
  try{
    const photoModels = await Photo.find({});
    console.log("PhotoModels:", photoModels, photoModels.length);
    let photoCount = photoModels.length;
    response.status(200).json(photoCount);
  } catch(err){
    console.error(err);
    response.status(400).send("Internal server error");
  }
});

/**
 * URL /admin/login 
 */
app.post('/admin/login', async (request, response) => {
  console.log("/admin/login called", request.body);
  if(!request.body){
    console.log("Admin/login: no request body");
  }
  const { username, password } = request.body;
  //find user
  const user = await User.findOne({ login_name: username, password }); 
  if(user){
    request.session.user = {
      id: user._id, 
      name: user.first_name, 
      username: user.login_name
    };
    console.log("session:", request.session);
    return response.json({ success: true, user: request.session.user, id: user._id, firstName: user.first_name });
  } else {
    console.log("failed log in");
    return response.status(401).send("Invalid username or password");
  }
});

/**
 * URL /admin/logout
 */
app.post('/admin/logout', (request, response) => {
  request.session.destroy((err) => {
    if(err){
      console.error("Couldn't destroy session", err);
      return response.status(500).send("Error logging out");
    }
    response.clearCookie("connect.sid");
    return response.json({ success:true });
  });
});

/**
 * URL /session
 */
app.get("/session", async (request, response) => {
  console.log("request", request.session);
  if(request.session.user){
    console.log(request.session.user);
    const user = await User.findById(request.session.user.id); 
    if(user){
      return response.status(200).json({ username: user.login_name, firstName: user.first_name});
    }
  }
  return response.status(401);
});

/**
 * SESSION CHECKER MIDDLEWARE
 */
app.use((request, response, next) => {
  if (request.session.user) {
    return next();
  }
  return response.status(401).send();
});


/**
 * URL /user/list - Returns all the User objects.
 */
app.get('/user/list', async (request, response) => {
  try{
    const userModels = await User.find({});
    const users = userModels.map((model) => {
      return {
        _id: model.id,
        first_name: model.first_name,
        last_name: model.last_name
      };
    });
    const toRet = users.flat();
    response.status(200).json(toRet);
    console.log(toRet);
  } catch (err){
    console.error(err);
    response.status(400).send("Internal server error");
  }
});

/**
 * URL /user/:id - Returns the information for User (id).
 */
app.get('/user/:id', async (request, response) => {
  try{
    const userModel = await User.findById(request.params.id);
    const user = { 
      _id: userModel.id, 
      first_name: userModel.first_name, 
      last_name: userModel.last_name, 
      location: userModel.location, 
      description: userModel.description,
      occupation: userModel.occupation
    };
    response.status(200).json(user);
  } catch (err){
    console.error(err);
    response.status(400).send("Internal server error");
  }
});

/**
 * URL /photosOfUser/:id - Returns the Photos for User (id).
 */
app.get('/photosOfUser/:id', async (request, response) => {
  try{

    if(!ObjectId.isValid(request.params.id)){
      response.status(400);
      return;
    }
    const userId = new ObjectId(request.params.id);
    console.log("Userid, objid:", userId);

    const photos = await Photo.aggregate([
      {
        $match: { user_id: userId }
      }, {
        $unwind: { path:`$comments`, preserveNullAndEmptyArrays: true}
      }, {
        $lookup: {
          from: 'users', 
          localField: 'comments.user_id', 
          foreignField: '_id', 
          pipeline: [{$project: {first_name: 1, last_name: 1}}],
          as: 'commenter'
        }
      }, {
        $addFields: {
          "comments.user": { $arrayElemAt: ["$commenter", 0]}
        }
      }, {
        $group: {
          _id: `$_id`, 
          file_name: { $first: `$file_name` },
          date_time: { $first: `$date_time` },
          comments: { $push: `$comments` },
          user_id: { $first: `$user_id` }
        }
      }, {
        $sort: { date_time: -1 }
      }
    ]);
    console.log("PhotoModels:", photos);
    if(!photos) {
      response.status(404).send("No user found");
    }
    else {
      response.status(200).json(photos);
    }
  } catch (err){
    console.error(err);
    response.status(400).send("Internal server error");
  }
});

/**
 * URL /counts/:id - Returns the number of comments and photos by User (id).
 */
app.get('/counts/:id', async (request, response) => {
  try{
    const userId = new ObjectId(request.params.id);
    const photoModels = await Photo.aggregate([
      {
        $match: {
          $or: [
            { user_id: userId }, 
            { "comments.user_id": userId }
          ]
        }
      }, {
        $group: {
          _id: userId, 
          photoCount: {
            $sum: {
              $cond: [{ $eq: [`$user_id`, userId]}, 1, 0]
            }
          }, 
          commentCount: {
            $sum: {
              $size: {
                $filter: {
                  input: "$comments", 
                  as: "comment", 
                  cond: { $eq: ["$$comment.user_id", userId] }
                }
              }
            }
          }
        }
      }
    ]);
    response.status(200).json(photoModels);
    
  } catch(err){
    console.error(err);
    response.status(400).send("Internal server error");
  }
});

/**
 * URL /comments/:id - Returns the comments made by User (id).
 */
app.get('/comments/:id', async (request, response) => {
  try{
    const userId = new ObjectId(request.params.id);
    const comments = await Photo.aggregate([
      { 
        $unwind: "$comments" 
      }, { 
        $match: { "comments.user_id": userId } 
      }, {
        $lookup: {
          from: "users", 
          localField: "comments.user_id", 
          foreignField: "_id", 
          as: "commenter"
        }
      }, {
        $unwind: "$commenter"
      }, {
        $lookup: {
          from: "photos", 
          let: { posterId: "$user_id" }, 
          pipeline: [
            { $match: {$expr: {$eq: ["$user_id", "$$posterId"]}}}, 
            { $sort: {date_time: -1}}, 
            { $project: { _id: 1 }}
          ], 
          as: "allPostersPhotos"
        }
      }, {
        $addFields: {
          photoIndexInPosters: { $indexOfArray: ["$allPostersPhotos._id", "$_id"]}
        }
      }, {
        $project: {
          _id: 1, 
          commentId: "$comments._id",
          photoFileName: "$file_name",
          commenterId: "$comments.user_id",
          commenterFirstName: "$commenter.first_name",
          commenterLastName: "$commenter.last_name",
          comment: "$comments.comment",
          date_time: "$comments.date_time", 
          photoIndexInPosters: 1, 
          originalPostersId: "$user_id"
        }
      }
    ]);
    console.log("COMMENTS", comments);
    response.status(200).json(comments);
  } catch(err){
    console.error(err);
  }
});


const server = app.listen(portno, function () {
  const port = server.address().port;
  console.log(
    "Listening at http://localhost:" +
      port +
      " exporting the directory " +
      __dirname
  );
});
