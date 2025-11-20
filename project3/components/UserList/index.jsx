import React from 'react';
import {
  Divider,
  List,
  ListItemButton, /* changed from plain List Item */
  ListItemText,
  IconButton
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { fetchUserListDisplay } from '../../axiosAPI';

import './styles.css';
import { useNavigate } from 'react-router-dom';
import useStore from '../../appStore';


function UserList() {
  let advEnabled = useStore((s) => s.advEnabled);
  const navigate = useNavigate();

  let {data, isLoading, error} = useQuery({
    queryKey: ["userList", advEnabled],
    queryFn: () => fetchUserListDisplay(advEnabled)
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
    console.log("Clicked on user", user.first_name, user.last_name, user._id);
    navigate(`/users/${user._id}`);
  };

  const handlePhotoCountClick = (user) => {
    console.log("photo count click", user.first_name);
    navigate(`/photos/${user._id}/0`);
  };

  const handleCommentCountClick = (user) => {
    console.log("comment count click", user.first_name);
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

  return (
    <div>
      <List component="nav">
        {users.map(user => (
          <React.Fragment key={user._id}>
            <ListItemButton onClick={() => handleUserClick(user)}>
              <ListItemText primary={user.first_name + " " + user.last_name} />
              {advEnabled && (
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
