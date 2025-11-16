import { React, useState, useEffect } from 'react';
import { AppBar, Checkbox, FormControlLabel, Toolbar, Typography } from '@mui/material';
import './styles.css';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';

function TopBar({ advEnabled, toggleAdvEnabled }) {
  const [context, setContext] = useState("Home");
  const location = useLocation();
  
  useEffect(() => {
    getUserFromUrl(location.pathname);
  }, [location]);

  const getUserFromUrl = async (url) => {
    const terms = url.split("/");
    if(terms[1]){
      try {
        const response = await axios.get(`http://localhost:3001/user/${terms[2]}`);
        if(response.data){
          if(terms[1] === "photos"){
            setContext(`Photos of ${response.data.first_name} ${response.data.last_name}`);
          } else if(terms[1] === "users"){
            setContext(`${response.data.first_name} ${response.data.last_name}`);
          } else {
            setContext("Unknown");
          }
        }
      } catch(err){
        console.error("Error getting user from URL", err);
      }}
  };

  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar className='topbar-toolbar'>
        <Typography variant="h5" color="inherit" className="topbar-name">
          Isabella Pereira
        </Typography>

        <FormControlLabel control={
          <Checkbox checked={advEnabled} onChange={toggleAdvEnabled} color="default" />
          } label="Advanced Features" />

        {context && (
          <Typography variant="h5">
            {context}
          </Typography>
        )}
        
      </Toolbar>
    </AppBar>
  );
}

TopBar.propTypes = {
  advEnabled: PropTypes.bool.isRequired,
  toggleAdvEnabled: PropTypes.func.isRequired
};

export default TopBar;
