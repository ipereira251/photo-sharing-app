import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Typography, Button, Divider } from '@mui/material';
import { useQuery } from '@tanstack/react-query';

import './styles.css';
import { fetchUserInfo, fetchPopularPhotos } from '../../axiosAPI';
import useStore from '../../store/appStore';
import PhotoCard from "../PhotoCard";


function UserDetail({userId}) {
  let advEnabled = useStore((s) => s.advEnabled);
  const navigate = useNavigate();

  //query for user details
  let {data: user, isLoading, error} = useQuery({
    queryKey: ['userDetail', userId],
    queryFn: () => fetchUserInfo(userId)
  });

  //query for user photos
  let {data: photos, isLoading: photosLoading, error: photosError} = useQuery({
    queryKey: ['userDetailPhotos', userId],
    queryFn: () => fetchPopularPhotos(userId)
  });

  if (isLoading) {
    return 'Loading ...';
  }

  if(photosLoading){
    return 'Loading photos...';
  }

  if (error) {
    return 'Could not fetch User profile';
  }

  if(photosError){
    return 'Could not fetch photos';
  }

  const handleViewImgClick = () => {
    console.log("Clicked to view images from userId", userId);
    if(advEnabled){
      navigate(`/photos/${userId}/0`);
    } else{
      navigate(`/photos/${userId}`);
    }
  };

  const handleSpotlightImgClick = (imageInfo) => {
    navigate(`/photos/${userId}/${imageInfo._id}`);
    //navigate to photo detail view
  };

  if(!user){
    return <p>No such user found.</p>;
  }

  if(!photos || photos.length === 0){
    return 'No photos available';
  }

  const mostRecentPhotoInfo = photos.mostRecent;
  const mostCommentedPhotoInfo = photos.mostCommented;

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
    <Divider />
    <div>
      <Typography variant="h6" className="spotlight-header">
        Photo Spotlight
      </Typography>
      <div className="photo-spotlight-images">
        <div onClick={() => handleSpotlightImgClick(mostRecentPhotoInfo)} >
          <Typography variant='body1' className="spotlight-text">
            Most Recent
          </Typography>
          <PhotoCard photoInfo={mostRecentPhotoInfo} />          
        </div>
        <div onClick={() => handleSpotlightImgClick(mostCommentedPhotoInfo)}>
          <Typography variant='body1' className="spotlight-text">
            Most Commented
          </Typography>
          <PhotoCard photoInfo={mostCommentedPhotoInfo} />
        </div>
      </div>
      
    </div>
    <Button variant="contained" onClick={() => handleViewImgClick()}>{`View all ${user.first_name}'s images`}</Button>
    </>
    
  );
}

UserDetail.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default UserDetail;
