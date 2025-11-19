import { React, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Typography, Button } from '@mui/material';

import './styles.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useUIStore from '../../store/ui-store';

function UserDetail({ userId }) {
  const {advEnabled} = useUIStore();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserInfo();
  }, [userId]); //NOT!!!! user

  const handleViewImgClick = () => {
    console.log("Clicked to view images from userId", userId);
    if(advEnabled)
      navigate(`/photos/${userId}/0`);
    else
      navigate(`/photos/${userId}`);
  }

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/user/${userId}`);
      if(response.data){
        console.log(response.data);
        setUser(response.data);
      }
    } catch (err){
      console.error("UserDetail: Error fetching user info: ", err);
    }
  };

  if(!user){
    return <p>No such user found.</p>;
  }

  return (
    <>
    <div> 
      <Typography variant="h5">
        {user.first_name} {user.last_name}
      </Typography>
      <Typography variant="h6" className="user-occ-loc">
        {user.occupation} from {user.location}.
      </Typography>
      <Typography variant="body1" className="user-desc">
        {user.description}
      </Typography>
    </div>
    <Button variant="contained" onClick={() => handleViewImgClick()}>{`View ${user.first_name}'s images`}</Button>
    </>
    
  );
}

UserDetail.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default UserDetail;
