import {Router} from "express";
import multer from "multer";
import fs from 'node:fs';
import { ObjectId } from "mongodb";
import {getUserList, getUser, getPhotos, getCountStats, getUserComments, postComment, postPhoto} from "./controller/app.js";

import User from "./schema/user.js";
import Photo from "./schema/photo.js";
import SchemaInfo from "./schema/schemaInfo.js";


const router = Router();

/**
 * URL /user/list - Returns all the User objects.
 */
router.get('/user/list', getUserList);

/**
 * URL /user/:id - Returns the information for User (id).
 */
router.get('/user/:id', getUser);

/**
 * URL /photosOfUser/:id - Returns the Photos for User (id).
 */
router.get('/photosOfUser/:id', getPhotos);

/**
 * URL /counts/:id - Returns the number of comments and photos by User (id).
 */
router.get('/counts/:id', getCountStats);

/**
 * URL /comments/:id - Returns the comments made by User (id).
 */
router.get('/comments/:id', getUserComments);

/**
 * URL /commentsOfPhoto/:photoId - Post a comment under a paticular photo
 */

router.post('/commentsOfPhoto/:photoId', postComment);

/**
 * URL /photos/new - Post a photo under the current user
 */

router.post('/photos/new', postPhoto);

export default router;