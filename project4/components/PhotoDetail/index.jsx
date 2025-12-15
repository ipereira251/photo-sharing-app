import PropTypes from 'prop-types';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import './styles.css';
import { fetchUserPhotos } from '../../axiosAPI';
import PhotoCard from '../PhotoCard';
import useStore from '../../store/appStore';


function PhotoDetail({userId, initialIndex}){
  let advEnabled = useStore((s) => s.advEnabled);
  let setAdvEnabled = useStore((s) => s.setAdvEnabled);
  let currentIndex = 0;
  let photoId;
  let url = window.location.pathname;
  const terms = url.split("/");
  if(terms[3]){
    photoId = terms[3];
  }

  let navigate = useNavigate();

  if (initialIndex){
    setAdvEnabled(true);
  }
  else {
    setAdvEnabled(false);
  }

  let {data: photos, isLoading, error} = useQuery({
    queryKey: ['photos', userId],
    queryFn: () => fetchUserPhotos(userId),
  });

  if (isLoading) {
   return "Loading Photo ...";
  }

  if (error) {
    return "Could not load User Photo";
  }

  let pathStem = `/photos/${userId}/`;
  
  console.log("Photo id i'm looking for", photoId);
  const index = photos.findIndex((x) => x._id === photoId);
  console.log("index", index);
  console.log("photos", photos);
  if(index !== -1){
    currentIndex = index;
  } else /*if(photoId === 0)*/{
    console.log("setting current index to 0");
    currentIndex = 0;
    if(photos[0]){
      console.log("photos[0] exists");
      photoId = photos[0]._id;
      navigate(pathStem + photos[0]._id);
    } else {
      console.log("photos[0] does not exist");
      navigate(pathStem);
    }
  }
  
  const goToPrev = () => {
    if(currentIndex > 0){
      console.log("prev id:", photos[(currentIndex - 1)]._id);
      navigate(pathStem + photos[(currentIndex - 1)]._id);
    }
  };

  const goToNext = () => {
    if(currentIndex < photos.length - 1){
      console.log("next id:", photos[(currentIndex + 1)]._id);
      navigate(pathStem + photos[(currentIndex + 1)]._id);
    }
    console.log("go to next index ", currentIndex);
  };

  return (
    <div className="carousel-container">
      <div className="carousel-nav"> 
        <IconButton onClick={goToPrev} disabled={currentIndex === 0}>
          Back
        </IconButton>
      </div>

      {( 
        <PhotoCard photoInfo={photos[currentIndex]} />
      )}

      <div className="carousel-nav"> 
        <IconButton onClick={goToNext} disabled={currentIndex === photos.length - 1}>
          Forward
        </IconButton>
      </div>
    </div>
  );
}

PhotoDetail.propTypes = {
  userId: PropTypes.string.isRequired
};

export default PhotoDetail;