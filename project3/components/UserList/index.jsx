import React, { useState, useEffect } from 'react';
import {
  Divider,
  List,
  ListItemButton, /* changed from plain List Item */
  ListItemText,
  IconButton, 
  Grid
} from '@mui/material';

import './styles.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useUIStore from '../../store/ui-store';
import useSessionStore from '../../store/session-store';

function UserList() {
  const {advEnabled} = useUIStore();
  const {loggedIn} = useSessionStore();
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [counts, setCounts] = useState([]);

  useEffect(() => {
    console.log("Logged in:", loggedIn);
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/user/list', {
          withCredentials: true
        }
        );
        if (response.status === 200 && response.data) {
          setUsers(response.data);
          console.log("UserList: Response:", response.data); 
          console.log("UserList: Fetched users.");
        } else {
          console.error("UserList: No users found.");
        }
      } catch (err) {
        if(err.response && err.response.status === 401){
          navigate('/login');

        } else {
          console.error("UserList: Error fetching users: ", err);
        }
      }
    };
    fetchUsers();
  }, [loggedIn]);

  useEffect(() => {
    if(advEnabled && users.length > 0){
      console.log("USERLIST: new adv", advEnabled);
      const fetchAllCounts = async () => {
        try {
          const arr = await Promise.all(users.map(async (user) => {
            const x = await fetchCounts(user._id);
            return x;
          }));
          setCounts(arr.flat());
          console.log("Fetched counts", arr.flat());
        } catch (err){
          console.error("USERLIST", err);
        }
      };
      
      fetchAllCounts();
    }
    
  }, [advEnabled, users]);


  const fetchCounts = async (userId) => {
    console.log("In fetchCounts"); 
    try{
      const response = await axios.get(`http://localhost:3001/counts/${userId}`);
      if(response.data){
        console.log(response.data);
        return response.data;
      }
      return 0;
    } catch (err){
      return console.error(err);
    }
  };

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
          {users.length === 0 ? (
            <ListItemText primary="No users available" />
          ) : (
            users.map(user => (
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
            ))
          )}
          
        </List>
   
    </div>
  );
}


export default UserList;
