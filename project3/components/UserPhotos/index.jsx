import { React, useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import './styles.css';
import axios from 'axios';
import { fetchUserPhotos } from '../../axiosAPI';
import PhotoCard from "../PhotoCard";
import PhotoDetail from "../PhotoDetail";
import { useQuery } from '@tanstack/react-query';

function UserPhotos({ userId, advEnabled, setAdvEnabled }) {
  setAdvEnabled(false);

  let {data: photos, isLoading, error} = useQuery({
    queryKey: ['userPhotos', userId],
    queryFn: () => fetchUserPhotos(userId),
  });

  if (isLoading) {
    return "Loading Photos ...";
  }

  if (error) {
    return "Cannot load users photos";
  }

  // useEffect(() => {
  //   if(!advEnabled){
  //     fetchUserPhotos();
  //   }
  //   else if(advEnabled){
  //     return <PhotoDetail userId={userId} initialIndex={0} advEnabled={advEnabled} />;
  //   }
  //   return console.log("UserPhotos:", photos);
  // }, [userId]);

  // const fetchUserPhotos = async () => {
  //   try {
  //     const response = await axios.get(`http://localhost:3001/photosOfUser/${userId}`);
      
  //     if(response.data){
  //       console.log("Response data:", response.data);
  //       setPhotos(response.data);
  //     }
  //   } catch (err) {
  //     console.error("UserPhotos: Error fetching photos: ", err);
  //   }
  // };

  // if(advEnabled && photos.length > 0){
  //   <PhotoDetail userId={userId} photos={photos} initialIndex={0} advEnabled={advEnabled} />;
  // }

  return (
    <div className="photo-card-container">
      {photos.length > 0 ? (
        photos.map((photo) => (
          <div className="photo-card" key={photo._id}>
            <PhotoCard photoInfo={photo} />
          </div>
        ))
      ) : (
        <Typography variant="body1">No photos found. </Typography>
      )}
    </div>
  );
}

UserPhotos.propTypes = {
  userId: PropTypes.string.isRequired,
  advEnabled: PropTypes.bool.isRequired
};

export default UserPhotos;
