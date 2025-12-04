import React from 'react';
import { Typography, Card, CardContent, CardMedia, Button, List, ListItem } from "@mui/material";
import "./styles.css";
import { useNavigate } from "react-router-dom";
import useAppStore from "../../store/appStore"
import useSessionStore from "../../store/sessionStore"
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postUserComment } from '../../axiosAPI';
import crypto from 'node:crypto';
import { Box, TextField, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function PhotoCard({photoInfo}){
  let selectedPhoto = useAppStore((s) => s.selectedPhoto);
  let setSelectedPhoto = useAppStore((s) => s.setSelectedPhoto);
  let currentText = useAppStore((s) => s.currentText);
  let setCurrentText = useAppStore((s) => s.setCurrentText);
  let firstName = useSessionStore((s) => s.firstName);
  const navigate = useNavigate();
  let queryClient = useQueryClient();

  let mutatation = useMutation({
    mutationFn: postUserComment,
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['photos', photoInfo.user_id] }),
  });

  const { isPending, submittedAt, variables, mutate, isError } = mutatation


  const comments = photoInfo.comments || [];
  const fileName = `/images/${photoInfo.file_name}`;
  const date = new Date(photoInfo.date_time);
  const formattedDate = date.toLocaleString();
  const photoId = photoInfo._id.toString();

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
    mutatation.mutate({photoId: photoId, comment: currentText});

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

  function viewLogic() {
    if (photoInfo._id.toString() !== selectedPhoto)
      return <Button variant="text" className="user-name-button comment-user-name-button"
                        onClick={selectPhoto}>
                        Add a comment 
              </Button>;
    else {
            return  (
              <>
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
              </>
            );
    }
  }
  
  return (
    <Card className="photo-card">
      <CardMedia className="photo-card-photo"
      component="img" image={fileName} />

      <CardContent> 
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

          {isPending && (
            <div className="commenter-info">
              <Button variant="text" className="user-name-button comment-user-name-button">
                {firstName}
              </Button>
              <Typography variant="p" className="date-time date-time-comment">
                {new Date().toLocaleString()}
              </Typography>
              <Typography variant="p">{variables.comment}</Typography>
            </div>
          )}

          {viewLogic()}

        </List>
      </CardContent>
    </Card>
  );
}

export default PhotoCard;