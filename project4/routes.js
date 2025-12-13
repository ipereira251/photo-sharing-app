import {Router} from "express";
import {getUserList, 
        getUserDetails, 
        getPhotos, 
        getPopularPhotos,
        getCountStats, 
        getUserComments, 
        postComment, 
        postPhoto, 
        getFavorites, 
        postFavorite, 
        deleteFavorite
      } from "./controller/app.js";

const router = Router();

/**
 * URL /user/list - Returns all the User objects.
 */
router.get('/user/list', getUserList);

/**
 * URL /user/:id - Returns the information for User (id).
 */
router.get('/user/:id', getUserDetails);

/**
 * URL /photosOfUser/:id - Returns the Photos for User (id).
 */
router.get('/photosOfUser/:id', getPhotos);

/**
 * URL /popularPhotosOfUser/:id - Returns the most recent and most commented-on Photos for User (id).
 */
router.get('/popularPhotosOfUser/:id', getPopularPhotos);

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

/**
 * URL GET /favorites - Returns a user's favorited photos
 */
router.get('/favorites', getFavorites);

/**
 * URL POST /favorites/post/:photoId - Adds photo to user's favorites list
 */
router.post('/favorites/:photoId', postFavorite);

/**
 * URL DELETE /favorites/delete/:photoId - Removes photo from user's favorites list
 */
router.post('/favorites/:photoId', deleteFavorite);

export default router;