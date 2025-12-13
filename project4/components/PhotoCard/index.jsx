import React, {useEffect} from 'react';
import { Typography, Card, CardContent, CardMedia, Button, List, ListItem } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import "./styles.css";
import { useNavigate } from "react-router-dom";
import useAppStore from "../../store/appStore"
import useSessionStore from "../../store/sessionStore"
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postUserComment, postLike } from '../../axiosAPI';
import axios from "axios";
import { Box, TextField, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function PhotoCard({photoInfo}){
  let selectedPhoto = useAppStore((s) => s.selectedPhoto);
  let setSelectedPhoto = useAppStore((s) => s.setSelectedPhoto);
  let currentText = useAppStore((s) => s.currentText);
  let setCurrentText = useAppStore((s) => s.setCurrentText);
  let firstName = useSessionStore((s) => s.firstName);

  const photoId = photoInfo._id.toString();

  const liked = useAppStore(
      (s) => s.likedById[photoId] ?? photoInfo.liked ?? false
  );

  let likeCountbyId = useAppStore((s) => s.likeCountbyId)
  const setLiked = useAppStore((s) => s.setLiked);
  const setLikeCount = useAppStore((s) => s.setLikeCount)

  useEffect(() => {
    setLiked(photoId, photoInfo.liked ?? false);
    setLikeCount(photoId, photoInfo.like_count ?? 0)

  }, [photoId, photoInfo.liked])

  const navigate = useNavigate();
  let queryClient = useQueryClient();

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

  // edge case where user has no photos
  if (!photoInfo) {
    return <></>
  }

  
  const comments = photoInfo.comments || [];
  const fileName = `/images/${photoInfo.file_name}`;
  const date = new Date(photoInfo.date_time);
  const formattedDate = date.toLocaleString();
  let likeCount = likeCountbyId[photoId]


  //handle name click
  const handleProfileClick = (userId) => {
    navigate(`/users/${userId}`);
  };

  function selectPhoto() {
    setSelectedPhoto(photoId);
    setCurrentText("");
  }

  function recordChange(e) {
    setCurrentText(e.target.value);
    console.log(`Recorded:  ${e.target.value}`);
  }

  function submitComment(e) {
    console.log(`Send post request with \`${currentText}\``);
    axios.post(`http://localhost:3001/commentsOfPhoto/${photoId}`, {comment: currentText}, {withCredentials: true});

    unselectPhoto();
  }

  function handleShortcutSubmit(e) {
    if (e.key === "Enter") {
      submitComment();
    }
  }

  function unselectPhoto(e) {
    setSelectedPhoto(null);
    setCurrentText(""); 
  }

  function likeHandler(e) {
    let oppState = !liked
    setLiked(photoId, oppState)

    if(oppState) {
      setLikeCount(photoId, ++likeCount)
    } else {
      setLikeCount(photoId, --likeCount)
    }

    axios.post(`http://localhost:3001/likePhoto/${photoId}`, {}, {withCredentials: true});

    
  }

  function viewLogic() {
    if (photoInfo._id.toString() !== selectedPhoto)
      {return (
        <Button variant="text" className="user-name-button comment-user-name-button"
          onClick={selectPhoto}>
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
                  <IconButton onClick={unselectPhoto} size="small">
                    <CloseIcon />
                  </IconButton>

                  <TextField
                    variant="outlined"
                    size="small"
                    placeholder="Write a comment..."
                    onChange={recordChange}
                    onKeyDown={handleShortcutSubmit}
                  />

                  <Button 
                    variant="contained" 
                    size="small" 
                    onClick={submitComment}
                  >
                    Submit
                  </Button>
                </Box>
            );
    }
  }
  
  return (
    <Card className="photo-card">
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