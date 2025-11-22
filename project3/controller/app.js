import multer from "multer";
import fs from 'node:fs';
import { ObjectId } from "mongodb";

import User from "../schema/user.js"
import Photo from "../schema/photo.js";
import SchemaInfo from "../schema/schemaInfo.js";

export async function getUserList(request, response) {
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
    ////console.log(toRet);
  } catch (err){
    //console.error(err);
    response.status(400).send("Internal server error");
  }
};

export async function getUser(request, response) {
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
};

export async function getPhotos(request, response) {
  try{

    if(!ObjectId.isValid(request.params.id)){
      response.status(400).send("No photos found");
      return;
    }
    const userId = new ObjectId(request.params.id);
    ////console.log("Userid, objid:", userId);

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
        $project: {
          "comments.user_id": 0
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
        $addFields: {
          comments: {
            $cond: {
              if: { $and: [
                { $eq: [{ $size: "$comments" }, 1] },
                { $eq: [{ $objectToArray: { $arrayElemAt: ["$comments", 0] } }, []] }
              ] },
              then: [],
              else: "$comments"
            }
          }
        }
      }, {
        $sort: { date_time: -1 }
      }
    ]);
    if(!photos || photos.length === 0) {
      response.status(404).send("No photos found");
    }
    else {
      response.status(200).json(photos);
      ////console.log("Photos of user:", photos);
    }
  } catch (err){
    //console.error(err);
    response.status(400).send("Internal server error");
  }
}

export async function getCountStats(request, response) {
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
    //console.error(err);
    response.status(400).send("Internal server error");
  }
};

export async function getUserComments (request, response) {
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
    ////console.log("COMMENTS", comments);
    response.status(200).json(comments);
  } catch(err){
    //console.error(err);
  }
};

export async function postComment (request, response) {

  ////console.log("Entering (post, /commentsOfPhoto/:photoId) endpoint");
  let comment = request.body.comment;
  let photoId = request.params.photoId;
  let userId = request.session.user.id;

  if (!comment) {
    return response.status(400).send(`Bad Request: ${comment}`);
  }

  let photo = await Photo.findById(photoId).exec();

  photo.comments.push({comment: comment, user_id: userId});
  try {
    await photo.save();
  } catch (err) {
    return response.status(500).json({err: err});
  }
  ////console.log(entry);

  return response.status(200).json({comment: comment, user_id: userId});
};

const processFormBody = multer({storage: multer.memoryStorage()}).single("uploadedphoto");

export async function postPhoto(request, response) {
  //console.log("entering endpoint (Post, /photos/new)");
  processFormBody(request, response, function (err) {
    if (err || !request.file) {
      //console.log("return status code of 400");
      return response.status(400).send("Bad Request");
    }

    const timestamp = new Date().valueOf();
    const filename = 'U' +  String(timestamp) + request.file.originalname;

    fs.writeFile("./images/" + filename, request.file.buffer, async function (err1) {
      if (err1) {
        ////console.log("return status code of 500");
        return response.status(500).json({error: "Could not save file"});
      }
      let photo = new Photo({file_name: filename, user_id: request.session.user.id, comments: []});
      await photo.save();

      //console.log("return status code of 200");
      return response.status(200).json(photo);
      
  });

    //console.log("return status code of 500");
    return response.status(500);
  });
};