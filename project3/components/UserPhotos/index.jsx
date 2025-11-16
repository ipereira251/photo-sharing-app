import { React, useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import './styles.css';
import axios from 'axios';
import PropTypes from 'prop-types';
import PhotoCard from "../PhotoCard";
import PhotoDetail from "../PhotoDetail";
import { useUIStore } from '../../store/ui-store';

function UserPhotos({ userId }) {
  const {advEnabled} = useUIStore((state) => ({
    advEnabled: state.advEnabled
  }));
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if(!advEnabled)
      fetchUserPhotos();
    else if(advEnabled)
      return <PhotoDetail userId={userId} initialIndex={0} />;
    console.log("UserPhotos:", photos);


  }, [userId]);

  const fetchUserPhotos = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/photosOfUser/${userId}`);
      
      if(response.data){
        console.log("Response data:", response.data);
        setPhotos(response.data);
      }
      setLoading(false);
    } catch (err) {
      console.error("UserPhotos: Error fetching photos: ", err);
      setLoading(false);
    }
  }

  return (
    <>
      {advEnabled && photos.length > 0 ? (
        <PhotoDetail userId={userId} photos={photos} initialIndex={0} />
      ) : (
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
      )}
    </>
  );
}

UserPhotos.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default UserPhotos;
