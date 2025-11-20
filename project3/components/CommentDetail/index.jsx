import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import './styles.css';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { fetchUserComments } from '../../axiosAPI';
import { useNavigate } from 'react-router-dom';
import { List, ListItem, Button, Typography, CardMedia } from "@mui/material";

function CommentDetail({ userId, advEnabled, setAdvEnabled }){
  if (!advEnabled)
    setAdvEnabled(true);
  
  const navigate = useNavigate();

  let {data: comments, isLoading, error} = useQuery({
    queryKey: ['commentDetail', userId],
    queryFn: () => fetchUserComments(userId),
  });

  if (isLoading) {
    return "Loading Comments ...";
  }

  if (error) {
    return "Could not load users comments =("
  }

  // useEffect(() => {
  //   if(!advEnabled){
  //     //get out!!! navigate away to user detail?
  //     navigate(`/users/${userId}`);
  //   } else {
  //     const loadComments = async () => {
  //       setLoading(true);
  //       await fetchComments();
  //       setLoading(false);
  //     };
  //     loadComments();
  //   }
  // }, [userId, advEnabled, navigate]);


  const handleProfileClick = (id) => {
    navigate(`/users/${id}`);
  };

  const handleListItemClick = (comment) => {
    console.log("Clicked list item", comment);
    if(comment.originalPostersId && comment.photoIndexInPosters !== undefined){
      console.log("Navigating", `/photos/${comment.originalPostersId}/${comment.photoIndexInPosters}`);
      navigate(`/photos/${comment.originalPostersId}/${comment.photoIndexInPosters}`);
    }
  };


  return(
    <List className="comments-container">
      {comments.length > 0 ? (
        comments.map(comment => (comment && comment.photoFileName && comment.commenterId 
          && comment.comment && comment.date_time && (
          <ListItem key={comment.commentId} className="comment" onClick={() => handleListItemClick(comment)}>
            <CardMedia className="thumbnail-photo" component="img" image={`/images/${comment.photoFileName}`} />
            <Button variant="text" className="user-name-button comment-user-name-button"
              onClick={(e) => {
              e.stopPropagation(); 
              handleProfileClick(comment.commenterId);}}>
              {comment.commenterFirstName} {comment.commenterLastName}
            </Button>
            <Typography variant="p" className="date-time date-time-comment">
              {new Date(comment.date_time).toLocaleString()}
            </Typography>
            <Typography variant="p">{comment.comment}</Typography>
          </ListItem>
        )))
      ) : (
        <Typography variant="body2" className="no-comment-text">No comments found.</Typography>
      )}
    </List>
  );
}

CommentDetail.propTypes = {
  userId: PropTypes.string.isRequired, 
  advEnabled: PropTypes.bool.isRequired
}

export default CommentDetail;