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
  if (advEnabled)
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
