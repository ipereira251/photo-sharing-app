import { React, useState, useEffect } from 'react';
import { AppBar, Checkbox, FormControlLabel, Toolbar, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import './styles.css';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import { getUserFromUrl } from '../../axiosAPI';

function TopBar({ advEnabled, setAdvEnabled }) {
  let location = useLocation();
  let url = location.pathname;
  let navigate = useNavigate();

  let { data, isLoading, error } = useQuery({
    queryKey: ['topbar', url],
    queryFn: () => getUserFromUrl(url),
  });

  let context = data;

  if (isLoading) {
    context = "";
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

  //please forgive me for the following code
  function toggleAdvEnabled() {
    setAdvEnabled((prev) => {

      //toggle the button to reflect the current state
      const currIsAdvEnabled = !prev;
      console.log("PHOTOSHARE New state:", currIsAdvEnabled);

      let photoDetailRouteMatch = /^\/photos\/[a-z0-9]+\/[0-9]+/.exec(window.location.pathname);

      //if you're on a Photo Detail route currently, and the Advanced Features button got turned off
      //then redirect to the User Photos route
      if (photoDetailRouteMatch && !currIsAdvEnabled) {
        let userId = photoDetailRouteMatch[0].split('/')[2];
        navigate(`/photos/${userId}`)
      }
      else {
        let userPhotosRouteMatch = /^\/photos\/[a-z0-9]+/.exec(window.location.pathname);

        //if you're on the User Photos route, and the Advanced Features button got turned on
        //then redirect to the first User Details route
        if (userPhotosRouteMatch && currIsAdvEnabled) {
          let userId = photoDetailRouteMatch[0].split('/')[2];
          navigate(`/photos/${userId}/0`);
        }
      }

    return currIsAdvEnabled;
    })
  }
}

TopBar.propTypes = {
  advEnabled: PropTypes.bool.isRequired,
  setAdvEnabled: PropTypes.func.isRequired
};

export default TopBar;
