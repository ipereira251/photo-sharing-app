import multer from "multer";
import fs from 'node:fs';
import { ObjectId } from "mongodb";

import User from "../schema/user.js";
import Photo from "../schema/photo.js";
import { PassThrough } from "node:stream";

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

    // console.log(users)
    const toRet = users.flat();
    response.status(200).json(toRet);
    ////////console.log(toRet);
  } catch (err){
    //console.error(err);
    response.status(400).send("Internal server error");
  }
}

export async function getUserDetails(request, response) {
  try{
    const userModel = await User.findById(new ObjectId(request.params.id));
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
}

export async function getPhotos(request, response) {
  try {

    if(!ObjectId.isValid(request.params.id)){
      response.status(400).send("Bad Request");
      return;
    }
    const userId = new ObjectId(request.params.id);
    const loggedInUserId = new ObjectId(request.session.user.id);

    // console.log(loggedInUserId.equals(new ObjectId("693a5bc454fac965d25917cb")))

    console.log(`Trying to get ${userId} for ${loggedInUserId}`)
    console.log(typeof(loggedInUserId))
    ////////console.log("Userid, objid:", userId);

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
          like_count: { $first: `$like_count`},
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
          },
        }
      }, {
          $lookup: {
            from: "users",
            let: {uid: loggedInUserId},
            pipeline: [
              { $match: { $expr: { $eq: ["$_id", "$$uid"]}}},
              { $project: {_id: 0, liked_photos: 1}}
            ],
            as: "ph"
          }
        }, {
          $addFields: {
            liked: {
              $in: [
                "$_id",
                { $ifNull: [{$first: "$ph.liked_photos"}, []]}
              ]
            }
          }
        }, {
        $sort: {like_count: -1,  date_time: -1 }
      }
    ]);

    if(!photos || photos.length === 0) {
      response.status(404).send("No photos found");
    }
    else {
      console.log(photos)
      response.status(200).json(photos);
      ////////console.log("Photos of user:", photos);
    }
  } catch (err) {
    console.error(err);
    response.status(400).send("Internal server error");
  }
}

export async function getPopularPhotos(request, response) {
  try{
    //////console.log("Given id:", request.params.id);
    if(!ObjectId.isValid(request.params.id)){
      response.status(400).send("Bad Request");
      return;
    }
    const userId = new ObjectId(request.params.id);
    const loggedInUserId = new ObjectId(request.session.user.id);

    const mostRecentPhoto = await Photo.aggregate([
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
          like_count: { $first: `$like_count`},
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
          $lookup: {
            from: "users",
            let: {uid: loggedInUserId},
            pipeline: [
              { $match: { $expr: { $eq: ["$_id", "$$uid"]}}},
              { $project: {_id: 0, liked_photos: 1}}
            ],
            as: "ph"
          }
        }, {
          $addFields: {
            liked: {
              $in: [
                "$_id",
                { $ifNull: [{$first: "$ph.liked_photos"}, []]}
              ]
            }
          }
        }, {
        $sort: { date_time: -1 }
      }, {
        $limit: 1
      }
    ]);

    const mostCommentedPhoto = await Photo.aggregate([
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
          "comments.user": { $arrayElemAt: ["$commenter", 0]}, 
        }
      }, {
        $group: {
          _id: `$_id`, 
          file_name: { $first: `$file_name` },
          like_count: { $first: `$like_count` },
          date_time: { $first: `$date_time` },
          comments: { $push: `$comments` },
          user_id: { $first: `$user_id` }
        }
      }, {
        $addFields: {
          commentCount: {
            $sum: {
              $size: {
                $filter: {
                  input: "$comments", 
                  as: "comment", 
                  cond: { 
                    $ne: ["$$comment", {}] 
                  }
                }
              }
            }
          }
        }
      }, {
          $lookup: {
            from: "users",
            let: {uid: loggedInUserId},
            pipeline: [
              { $match: { $expr: { $eq: ["$_id", "$$uid"]}}},
              { $project: {_id: 0, liked_photos: 1}}
            ],
            as: "ph"
          }
        }, {
          $addFields: {
            liked: {
              $in: [
                "$_id",
                { $ifNull: [{$first: "$ph.liked_photos"}, []]}
              ]
            }
          }
        }, {
        $sort: { 
          commentCount: -1
        }
      }, {
        $limit: 1
      }
    ]);

    if(!mostRecentPhoto || !mostCommentedPhoto){
      response.status(404).send("No photos found for user");
    }
    //////console.log(mostCommentedPhoto);
    response.status(200).json({mostRecent: mostRecentPhoto[0], mostCommented: mostCommentedPhoto[0]});
    
  } catch (err){
    console.error(err);
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
}

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
    ////////console.log("COMMENTS", comments);
    response.status(200).json(comments);
  } catch(err){
    //console.error(err);
  }
}

export async function postComment (request, response) {

  ////////console.log("Entering (post, /commentsOfPhoto/:photoId) endpoint");
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
  ////////console.log(entry);

  return response.status(200).json({comment: comment, user_id: userId});
}

export async function postLike(request, response) {
  try {
    const photoId = new ObjectId(request.params.photoId);
    const userId = request.session.user.id

    ////console.log(`Request to posting like for ${photoId} under ${userId}`)

    let user = await User.findById(userId)
    
    // if User has already liked the photo, then unlike it,
    // else like it

    // inc is passed to an accumlation aggregation stage for the photos collection

    let liked_photos = user.liked_photos || [];

    let didUserPrevLikedPhoto = liked_photos.includes(photoId);

    const LIKE_OP = 1;
    const UNLIKE_OP = -1;
    let currOperation;

    // if the user has not liked the photo, 
    // then set the operation to increment the like for that photo
    //      and record photo that the user has liked the photo in there liked_photos list
    
    // else set the operation to decrement the like photo,
    //      and remove the photo from the list of liked photos 


    if (!didUserPrevLikedPhoto) {
      currOperation = LIKE_OP
      liked_photos.push(photoId)
    } else {
      currOperation = UNLIKE_OP
      
      // removes photoId from list of liked photos

      // make sure not to use === as that compares references
      // and were comparing by values
      liked_photos = liked_photos.filter(entry => !entry.equals(photoId))
    }

    // prevents unliking a photo with 0 likes, the use of -1 is to match all photos
    // Used in updating the photos likes in the mongodb collection
    let zero_likes_edge_case = currOperation === UNLIKE_OP ? 0 : -1

    user.liked_photos = liked_photos
    let saved_user_promise = user.save()

    let edit_photo_promise = Photo.updateOne(
      {_id: photoId,
        // prevent unliking a photo with 0 likes, the use of -1 is to match all photos
        like_count: {$gt: zero_likes_edge_case}
      }, {
        $inc: {like_count: currOperation }
      }
    )

    Promise.all([saved_user_promise, edit_photo_promise])
    .then(() => {
      return response.status(200).send("Successfully updated photo")
    })
    .catch((err) => {
      ////console.log(err)
      return response.status(500).send("Failed liking the photo")
    })
  }
  catch (err) {
    ////console.log(err)
    return response.status(500).send("Failed liking the photo")
  }
}

const processFormBody = multer({storage: multer.memoryStorage()}).single("uploadedphoto");

export async function postPhoto(request, response) {
  //////console.log("entering endpoint (Post, /photos/new)");
  processFormBody(request, response, function (err) {
    if (err || !request.file) {
      //////console.log("return status code of 400");
      return response.status(400).send("Bad Request");
    }

    const timestamp = new Date().valueOf();
    const filename = 'U' +  String(timestamp) + request.file.originalname;

    fs.writeFile("./images/" + filename, request.file.buffer, async function (err1) {
      if (err1) {
        ////////console.log("return status code of 500");
        return response.status(500).json({error: "Could not save file"});
      }
      let photo = new Photo({file_name: filename, user_id: request.session.user.id, comments: [], likes: 0});
      await photo.save();

      //////console.log("return status code of 200");
      return response.status(200).json(photo);
      
  });

    //////console.log("return status code of 500");
    return response.status(500);
  });
}