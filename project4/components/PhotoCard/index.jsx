import React, {useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import axios from "axios";
import "./styles.css";
import { Typography, 
        Card, 
        CardContent, 
        CardMedia, 
        Button, 
        List, 
        ListItem,  
        Box, 
        TextField, 
        IconButton, 
        Tooltip} from "@mui/material";

import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import CloseIcon from '@mui/icons-material/Close';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import socket from "../../socket";
import useAppStore from "../../store/appStore";
import useSessionStore from "../../store/sessionStore";
import { postUserComment, fetchUserFavorites, addUserFavorite, postLike } from '../../axiosAPI';

function PhotoCard({photoInfo}){
  let selectedPhoto = useAppStore((s) => s.selectedPhoto);
  let setSelectedPhoto = useAppStore((s) => s.setSelectedPhoto);
  let currentText = useAppStore((s) => s.currentText);
  let setCurrentText = useAppStore((s) => s.setCurrentText);
  let firstName = useSessionStore((s) => s.firstName);

  const photoId = photoInfo?._id ? photoInfo._id.toString() : null;
  
  const liked = useAppStore(
      (s) => s.likedById[photoId] ?? photoInfo?.liked ?? false
  );

  let likeCountbyId = useAppStore((s) => s.likeCountbyId);
  const setLiked = useAppStore((s) => s.setLiked);
  const setLikeCount = useAppStore((s) => s.setLikeCount);

  useEffect(() => {
    setLiked(photoId, photoInfo.liked ?? false);
    setLikeCount(photoId, photoInfo.like_count ?? 0);

    let updateLikes = ({photoId, like_count}) => {
      setLikeCount(photoId, like_count);
    };

    socket.on("photo:like", updateLikes);

    return () => {
      socket.off("photo:like", updateLikes);
    };

  }, [photoId, photoInfo?.liked])

  const navigate = useNavigate();
  let queryClient = useQueryClient();
  const currentUserId = useSessionStore((s) => s.userId);

  // let likeMutation = useMutation({
  //   mutationFn: postLike

  //   // I feel like it doesn't make sense to invalidate queires since updates are 
  //   // done opmitmistically on client side
  // })

  // let commentMutatation = useMutation({
  //   mutationFn: postLike,
  //   onSettled: () => queryClient.invalidateQueries({ queryKey: ['photos', photoInfo.user_id] }),
  // });

  // const { isPending, submittedAt, variables, mutate, isError } = commentMutatation;

  //favorites
  let {data: favorites} = useQuery({
    queryKey: ['userFavorites', currentUserId], 
    queryFn: () => fetchUserFavorites(currentUserId)
  });

  //usemutation for a click
  let mutateFavorites = useMutation({
    mutationFn: addUserFavorite, 
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['userFavorites', currentUserId]})
  });

  // edge case where user has no photos
  if (!photoInfo) {
    return <></>;
  }

  if (! (photoInfo?._id)) {
    return <></>
  }


  
  const comments = photoInfo.comments || [];
  const fileName = `/images/${photoInfo.file_name}`;
  const date = new Date(photoInfo.date_time);
  const formattedDate = date.toLocaleString();
  let likeCount = likeCountbyId[photoId];


  let isFavorited = false;
  if(favorites && favorites.length){
    isFavorited = favorites.some(fav => fav.photo && fav.photo._id && fav.photo._id.toString() === photoId);
  }

  //handle name click
  const handleProfileClick = (userId) => {
    navigate(`/users/${userId}`);
  };

  function selectPhoto(e) {
    e.stopPropagation();
    e.preventDefault();
    setSelectedPhoto(photoId);
    setCurrentText("");
  }

  function recordChange(e) {
    e.stopPropagation();
    e.preventDefault();
    setCurrentText(e.target.value);
    console.log(`Recorded:  ${e.target.value}`);
  }

  function submitComment(e) {
    if (e) e.stopPropagation();
    console.log(`Send post request with \`${currentText}\``);
    axios.post(`http://localhost:3001/commentsOfPhoto/${photoId}`, {comment: currentText}, {withCredentials: true})
    .then(() => {
      queryClient.invalidateQueries({ queryKey: ['photos', photoInfo.user_id.toString()] });
      queryClient.invalidateQueries({ queryKey: ['userList'] });

      queryClient.invalidateQueries(['userDetailPhotos', photoInfo.user_id]);
      refetch();
    });
    console.log("invalidating");
    
    unselectPhoto();
  }

  function handleShortcutSubmit(e) {
    if (e.key === "Enter") {
      submitComment();
    }
  }

  function unselectPhoto() {
    setSelectedPhoto(null);
    setCurrentText(""); 
  }

  function likeHandler(e) {
    e.stopPropagation(); //prevent from going to photo detail
    let oppState = !liked;
    setLiked(photoId, oppState);

    if(oppState) {
      setLikeCount(photoId, ++likeCount);
    } else {
      setLikeCount(photoId, --likeCount);
    }

    axios.post(`http://localhost:3001/likePhoto/${photoId}`, {}, {withCredentials: true})
    .then(() => {
      socket.emit("photo:like", {photoId})
      // This is needed for user details view
      queryClient.invalidateQueries({ queryKey: ['photos', photoInfo.user_id.toString()] });
    })

    
  }

  function viewLogic() {
    if (photoInfo._id.toString() !== selectedPhoto)
      {return (
        <Button variant="text" className="user-name-button comment-user-name-button"
          onClick={(e) => selectPhoto(e)}>
            Add a comment 
        </Button>
);}
    else {
      return  (
                <Box 
                  display="flex" 
                  alignItems="center" 
                  gap={2}        
                  sx={{ padding: 1 }}
                >
                  <IconButton onClick={(e) => unselectPhoto(e)} size="small">
                    <CloseIcon />
                  </IconButton>

                  <TextField
                    variant="outlined"
                    size="small"
                    placeholder="Write a comment..."
                    onChange={recordChange}
                    onKeyDown={handleShortcutSubmit}
                    onClick={(e) => e.stopPropagation()}
                  />

                  <Button 
                    variant="contained" 
                    size="small" 
                    onClick={(e) => submitComment(e)}
                  >
                    Submit
                  </Button>
                </Box>
            );
    }
  }

  const handleFavoriteClick = () => {
    //mutate the current user's favorite list
    mutateFavorites.mutate(photoId);
  };
  
  return (
    <Card className="photo-card">
      <div className="favorite-star-wrapper">
        {isFavorited ? (
          <Tooltip title="Already in favorites"> 
            <StarIcon className="gold-star-fill" sx={{ color: 'gold' }} /> 
          </Tooltip>
        ) : (
          <IconButton onClick={(e) => {
            e.stopPropagation();
            handleFavoriteClick();}}> 
            <StarBorderIcon />
          </IconButton>
        )}
      </div>

      <CardMedia className="photo-card-photo"
      component="img" image={fileName} />

      <CardContent> 
        <IconButton
              onClick={likeHandler}
              aria-label="like photo"
            >

              {liked ? (
                <ThumbUpIcon />
              ) : (
                <ThumbUpOutlinedIcon />
              )}

              <Typography variant="body2" sx={{ ml: 0.5 }}  >
                {likeCount}
              </Typography>
        </IconButton>

        <Typography variant="body2" noWrap={true} className="date-time">
          Posted {formattedDate}.
        </Typography>

        <List className="comments-container">
          {(comments.length > 0 ? (
            comments.map(comment => (comment && comment.user && comment.comment && (
              <ListItem key={comment._id} className="comment">
                <div className="commenter-info">
                  <Button variant="text" className="user-name-button comment-user-name-button"
                    onClick={() => handleProfileClick(comment.user._id)}>
                    {comment.user.first_name} {comment.user.last_name} 
                  </Button>
                  <Typography variant="p" className="date-time date-time-comment">
                    {new Date(comment.date_time).toLocaleString()}
                  </Typography>
                </div>
                
                <Typography variant="p">{comment.comment}</Typography>
              </ListItem>
            )
            ))
          ) : (
            <Typography variant="body2" className="no-comment-text">No comments found.</Typography>
          ))}

          {/* {isPending && (
            <div className="commenter-info">
              <Button variant="text" className="user-name-button comment-user-name-button">
                {firstName}
              </Button>
              <Typography variant="p" className="date-time date-time-comment">
                {new Date().toLocaleString()}
              </Typography>
              <Typography variant="p">{variables.comment}</Typography>
            </div>
          )} */}

          {viewLogic()}

        </List>
      </CardContent>
    </Card>
  );
}

export default PhotoCard;