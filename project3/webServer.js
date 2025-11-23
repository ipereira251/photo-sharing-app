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
import session from "express-session";
import router from "./routes.js";
import { login, logout, register, getSession, isAuthenicated } from "./controller/authentication.js";

import Photo from "./schema/photo.js";
import SchemaInfo from "./schema/schemaInfo.js";


const portno = 3001; // Port number to use
const app = express();

// Enable CORS for all routes
app.use((req, res, next) => {
  //This might be an issue when we do web sockets for project 4 since it's a different scheme than htpp
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

app.get("/", function (_request, response) {
  response.send("Simple web server of files from " + __dirname);
});

/**
 * /test/info - Returns the SchemaInfo object of the database in JSON format.
 *              This is good for testing connectivity with MongoDB.
 */

app.get('/test/info', (request, response) => {
  const info = SchemaInfo; //models.schemaInfo();
  response.status(200).send(info);
  //console.log(info, "trying");
});

/**
 * /test/counts - Returns an object with the counts of the different collections
 *                in JSON format.
 */
app.get('/test/counts', async (request, response) => {
  try{
    const photoModels = await Photo.find({});
    //console.log("PhotoModels:", photoModels, photoModels.length);
    let photoCount = photoModels.length;
    response.status(200).json(photoCount);
  } catch(err){
    //console.error(err);
    response.status(400).send("Internal server error");
  }
});

/**
 * URL /admin/login - Logs user in.
 */
app.post('/admin/login', login);

/**
 * URL /admin/logout - Logs current user out.
 */
app.post('/admin/logout', logout);

/**
 * URL /user - Registers a user.
 */
app.post('/user', register);

/**
 * URL /session - Gets session information.
 */

app.get("/session", getSession);

/**
 * SESSION CHECKER MIDDLEWARE
 */

app.use(isAuthenicated, router);  

const server = app.listen(portno, function () {
  const port = server.address().port;
  console.log(
    "Listening at http://localhost:" +
      port +
      " exporting the directory " +
      __dirname
  );
});
