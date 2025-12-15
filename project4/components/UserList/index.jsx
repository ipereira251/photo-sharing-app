import React from 'react';
import {
  Divider,
  List,
  ListItemButton, /* changed from plain List Item */
  ListItemText,
  IconButton
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { fetchUserListDisplay } from '../../axiosAPI';

import './styles.css';
import useStore from '../../store/appStore';
import useSessionStore from '../../store/sessionStore';
import CircleIcon from "@mui/icons-material/Circle";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import ChatIcon from "@mui/icons-material/Chat";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";


function UserList() {
  let advEnabled = useStore((s) => s.advEnabled);
  const navigate = useNavigate();
  const {loggedIn} = useSessionStore();

  let {data, isLoading, error} = useQuery({
    queryKey: ["userList"],
    queryFn: () => fetchUserListDisplay(advEnabled), 
    enabled: loggedIn
  });

  if (isLoading) {
    return "";
  }
  
  if (error) {
    return "Could not load Users";
  }
 
  console.log(data);
  
  let {users, counts} = data ?? {users: [], counts: null};


  const handleUserClick = (user) => {
    navigate(`/users/${user._id}`);
  };

  const handlePhotoCountClick = (user) => {
    navigate(`/photos/${user._id}/0`);
  };

  const handleCommentCountClick = (user) => {
    navigate(`/comments/${user._id}`);
  };

  const getPhotoCount = (user) => {
    if(counts){
      const obj = counts.find(u => u._id === user._id.toString());
      if(obj){
        console.log(obj);
        return obj.photoCount;
      }
    }
    return 0;
  };

  const getCommentCount = (user) => {
    if(counts){
      const obj = counts.find(u => u._id === user._id.toString());
      if(obj){
        console.log(obj);
        return obj.commentCount;
      }
    }
    return 0;
  };

  // function getDisplayIcon(last_activity) {
  //   let displayIcon;

  //   switch (last_activity) {
  //     case "LOGGED_IN":
  //       displayIcon = <CircleIcon sx={{ color: "success.main", fontSize: 12, pr: 1 }} />;
  //       break;
  //     case "LOGGED_OUT":
  //        displayIcon = <CircleIcon sx={{ color: "text.disabled", fontSize: 12, pr: 1 }} />,
  //       break;
  //     case "REGISTERED":
  //        displayIcon = <PriorityHighIcon color="error" sx={{pr: 1}} />
  //       break;
  //     case "POST_COMMENT":
  //        displayIcon = <ChatIcon sx={{ fontSize: 20, color: "action.active", pr: 1 }} />
  //       break;
  //     case "POST_PHOTO":
  //        displayIcon = <PhotoCameraIcon sx={{color: "primary", pr: 1}} />
  //        break;
  //   }
    
  //   return displayIcon
  // }

  let activityIcons = {
    LOGGED_IN: <CircleIcon sx={{ color: "success.main", fontSize: 12, pr: 1 }} />,
    LOGGED_OUT: <CircleIcon sx={{ color: "text.disabled", fontSize: 12, pr: 1 }} />,
    REGISTERED: <PriorityHighIcon color="error" sx={{pr: 1}} />,
    POST_COMMENT: <ChatIcon sx={{ fontSize: 20, color: "action.active", pr: 1 }} />,
    POST_PHOTO: <PhotoCameraIcon sx={{color: "primary", pr: 1}} />
  }

  console.log(users)

  return (
    <div>
      <List component="nav">
        {users.map(user => (
          <React.Fragment key={user._id}>
            <ListItemButton onClick={() => handleUserClick(user)}>
              {activityIcons[user.last_activity]}
              {user.context_of_last_activity && <CardMedia className="thumbnail-photo" component="img" image={user.context_of_last_activity} /> }              
              <ListItemText primary={user.first_name + " " + user.last_name} />
              {context_of_last_activity && (
                <>
                  <IconButton className="photo-count-button" 
                  onClick={(e) => {
                    e.stopPropagation(); 
                    handlePhotoCountClick(user);}}>{getPhotoCount(user)}
                  </IconButton>
                  <IconButton className="comment-count-button" 
                    onClick={(e) => {
                    e.stopPropagation();
                    handleCommentCountClick(user);}}>{getCommentCount(user)}
                  </IconButton>
                </>
              )}
            </ListItemButton>
            <Divider/>
          </React.Fragment>
        ))}
      </List>
    </div>
  );
}

export default UserList;
