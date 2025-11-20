import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Typography, Button } from '@mui/material';
import { useQuery } from '@tanstack/react-query';

import './styles.css';
import { fetchUserInfo } from '../../axiosAPI';
import useStore from '../../appStore';


function UserDetail({userId}) {
  let advEnabled = useStore((s) => s.advEnabled);
  const navigate = useNavigate();


  let {data: user, isLoading, error} = useQuery({
    queryKey: ['userDetail', userId],
    queryFn: () => fetchUserInfo(userId)
  })

  if (isLoading) {
    return 'Loading ...';
  }

  if (error) {
    return 'Could not fetch User profile';
  }

  const handleViewImgClick = () => {
    console.log("Clicked to view images from userId", userId);
    if(advEnabled)
      navigate(`/photos/${userId}/0`);
    else
      navigate(`/photos/${userId}`);
  }

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
