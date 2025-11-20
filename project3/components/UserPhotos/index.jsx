import { React, useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import './styles.css';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import PhotoCard from "../PhotoCard";
import useUIStore from '../../store/ui-store';
import useSessionStore from '../../store/session-store';

function UserPhotos({ userId }) {
  const {advEnabled} = useUIStore();
  const {loggedIn} = useSessionStore();
  const [photos, setPhotos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if(!loggedIn){
      navigate('/login');
    }
    const fetchUserPhotos = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/photosOfUser/${userId}`, {
        withCredentials: true
      });
      
      if(response.data){
        console.log("Response data:", response.data);
        setPhotos(response.data);
      }
    } catch (err) {
      console.error("UserPhotos: Error fetching photos: ", err);
    }
  };

    if(!advEnabled){
      fetchUserPhotos();
      console.log("adv toggled off");
      navigate(`/photos/${userId}`);
    }
    else {
      console.log("redirecting to photo detail");
      navigate(`/photos/${userId}/0`);
      //return <PhotoDetail userId={userId} initialIndex={0} advEnabled={advEnabled} />;
    }
    return console.log("UserPhotos:", photos);
  }, [userId, advEnabled]);

  if(advEnabled && photos.length > 0){
    console.log("User photos mounting Photodetail");

    //return <PhotoDetail userId={userId} photos={photos} initialIndex={0} advEnabled={advEnabled} />;
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