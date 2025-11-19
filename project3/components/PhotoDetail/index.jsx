import PropTypes from 'prop-types';
import { React, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IconButton } from '@mui/material';
import './styles.css';
import axios from 'axios';
import useUIStore from '../../store/ui-store';
import PhotoCard from '../PhotoCard';

function PhotoDetail({ userId, initialIndex }){
  const {advEnabled} = useUIStore();
  const [photos, setPhotos] = useState([]);
  const location = useLocation();

  const [currentIndex, setCurrentIndex] = useState(initialIndex || 0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();    


  useEffect(() => {
    if(!initialIndex){
      parseIndex(location);
    }
    console.log("Photodetail Props", userId, initialIndex, advEnabled);
    
    if(!advEnabled){
      console.log("Tried to view single image without Adv on");
      const path = `/photos/${userId}`; //regular photo list
      if(window.location.pathname !== path)
        navigate(path);
    }
    if(userId && advEnabled){
      fetchUserPhotos();
      console.log(window.location.pathname);
      if(currentIndex === undefined){
        setCurrentIndex(initialIndex);
      }
      const path = `/photos/${userId}/${currentIndex}`;
      console.log("Current index:", currentIndex);
      if(window.location.pathname !== path)
        navigate(path);
    }
    console.log("PHOTODETAIL:", userId, initialIndex, currentIndex);
  }, [userId, currentIndex, advEnabled, navigate]);

  const parseIndex = (location) => {
    const terms = location.pathname.split("/");
    console.log("terms", terms);
    if(terms[3] === "")
      initialIndex = 0;
    else
      initialIndex = terms[3];
  }

  const fetchUserPhotos = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/photosOfUser/${userId}`);
      console.log(response);
      if(response.data){
        setPhotos(response.data);
        setLoading(false);
      }
    } catch (err) {
      console.error("PhotoDetail: Error fetching photos: ", err);
    }
  }

  const goToPrev = () => {
    if(currentIndex > 0){
      setCurrentIndex(currentIndex - 1);
    }
  }

  const goToNext = () => {
    if(currentIndex < photos.length - 1){
      setCurrentIndex(currentIndex + 1);
    }
    console.log("go to next: ", currentIndex);
  }
  
  if(!userId || photos.length === 0 || currentIndex === undefined){
    console.log("Userid", userId);
    console.log("curr", currentIndex);
    return <p>Loading....</p>;
  }
    

  return (
    <div className="carousel-container">
      <div className="carousel-nav"> 
        <IconButton onClick={goToPrev} disabled={currentIndex === 0}>
          Back
        </IconButton>
      </div>

      {photos.length > 0 && !loading && ( 
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
}

export default PhotoDetail;