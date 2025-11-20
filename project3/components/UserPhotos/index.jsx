import React from 'react';
import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import './styles.css';
import { fetchUserPhotos } from '../../axiosAPI';
import PhotoCard from "../PhotoCard";
import { useQuery } from '@tanstack/react-query';
import useStore from '../../appStore';

function UserPhotos({ userId }) {
  let advEnabled = useStore((s) => s.advEnabled);
  let setAdvEnabled = useStore((s) => s.setAdvEnabled);

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
};

export default UserPhotos;
