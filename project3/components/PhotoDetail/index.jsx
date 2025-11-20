import PropTypes from 'prop-types';
import { React, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IconButton } from '@mui/material';
import './styles.css';
import axios from 'axios';
import { fetchUserPhotos } from '../../axiosAPI';
import { useQuery } from '@tanstack/react-query';
import PhotoCard from '../PhotoCard';

function PhotoDetail({ userId, initialIndex, advEnabled, setAdvEnabled}){
  let navigate = useNavigate();

  if (!advEnabled)
    setAdvEnabled(true);

  let {data: photos, isLoading, error} = useQuery({
    queryKey: ['PhotoDetail', userId],
    queryFn: () => fetchUserPhotos(userId),
  });

  if (isLoading) {
   return "Loading Photo ..."
  }

  if (error) {
    return "Could not load User Photo"
  }
  

  // useEffect(() => {
  //   if(!initialIndex){
  //     parseIndex(location);
  //   }
  //   console.log("Photodetail Props", userId, initialIndex, advEnabled);
    
  //   if(!advEnabled){
  //     console.log("Tried to view single image without Adv on");
  //     const path = `/photos/${userId}`; //regular photo list
  //     if(window.location.pathname !== path)
  //       navigate(path);
  //   }
  //   if(userId && advEnabled){
  //     fetchUserPhotos();
  //     console.log(window.location.pathname);
  //     if(currentIndex === undefined){
  //       setCurrentIndex(initialIndex);
  //     }
  //     const path = `/photos/${userId}/${currentIndex}`;
  //     console.log("Current index:", currentIndex);
  //     if(window.location.pathname !== path)
  //       navigate(path);
  //   }
  //   console.log("PHOTODETAIL:", userId, initialIndex, currentIndex);
  // }, [userId, currentIndex, advEnabled, navigate]);

  // const parseIndex = (loc) => {
  //   const terms = loc.pathname.split("/");
  //   console.log("terms", terms);
  //   if(terms[3] === ""){
  //     initialIndex = 0;
  //   } else{
  //     initialIndex = terms[3];
  //   }
  // };

  //If the index is not a number
  //then yell at the user
  if(!/[0-9]+/.test(String(initialIndex))) {
    return "Not a number";
  }

  let currentIndex = Number(initialIndex);

  //If the index is not in bounds
  //then yell at the user
  if(! ( 0 <= currentIndex && currentIndex < photos.length)) {
    return "out of bounds";
  }

  let url = window.location.pathname;
  let pathStem = `/photos/${userId}/`
  
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
  advEnabled: PropTypes.bool.isRequired
};

export default PhotoDetail;