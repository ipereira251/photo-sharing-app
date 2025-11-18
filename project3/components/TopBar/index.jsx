import { React, useState, useEffect } from 'react';
import { AppBar, Checkbox, FormControlLabel, Toolbar, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query'
import './styles.css';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';

function TopBar({ advEnabled, toggleAdvEnabled }) {
  let location = useLocation();
  let url = location.pathname;

  const getUserFromUrl = async (url) => {
    if (url === '/') {
      return "Home";
    }

    const terms = url.split("/");

    if(terms[1]){
      const response = await axios.get(`http://localhost:3001/user/${terms[2]}`);

      if(response.data){
        if(terms[1] === "photos"){
          return `Photos of ${response.data.first_name} ${response.data.last_name}`;
        } else if(terms[1] === "users"){
          return `${response.data.first_name} ${response.data.last_name}`;
        } else {
          return "Unknown";
        }
      }
    }

    return "Unknown";
  };

  let { data, isLoading, error } = useQuery({
    queryKey: ['topbar', url],
    queryFn: () => getUserFromUrl(url),
  });

  let context = data;

  if (isLoading) {
    context = "...";
  }

  if (error) {
    console.error(error);
    context = "Could not get User data";
  }

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
