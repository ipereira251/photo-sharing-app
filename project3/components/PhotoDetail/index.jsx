import PropTypes from 'prop-types';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import './styles.css';
import { fetchUserPhotos } from '../../axiosAPI';
import { useQuery } from '@tanstack/react-query';
import PhotoCard from '../PhotoCard';
import useStore from '../../store/appStore';


function PhotoDetail({userId, initialIndex}){
  let advEnabled = useStore((s) => s.advEnabled);
  let setAdvEnabled = useStore((s) => s.setAdvEnabled);

  let navigate = useNavigate();

  if (!advEnabled){
    setAdvEnabled(true);
  }

  let {data: photos, isLoading, error} = useQuery({
    queryKey: ['PhotoDetail', userId],
    queryFn: () => fetchUserPhotos(userId),
  });

  if (isLoading) {
   return "Loading Photo ...";
  }

  if (error) {
    return "Could not load User Photo";
  }
  
  //If the index is not in bounds
  //then yell at the user
  if(!/[0-9]+/.test(String(initialIndex))) {
    return "Not a number";
  }

  let currentIndex = Number(initialIndex);

  //If the index is not in bounds
  //then yell at the user
  if(! (currentIndex >= 0 && currentIndex < photos.length)) {
    return "out of bounds";
  }

  //let url = window.location.pathname;
  let pathStem = `/photos/${userId}/`;
  
  const goToPrev = () => {
    if(currentIndex > 0){
      navigate(pathStem + (currentIndex - 1));
    }
  };

  const goToNext = () => {
    if(currentIndex < photos.length - 1){
      navigate(pathStem + (currentIndex + 1));
    }
    console.log("go to next: ", currentIndex);
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
  userId: PropTypes.string.isRequired, 
  initialIndex: PropTypes.number.isRequired,
};

export default PhotoDetail;