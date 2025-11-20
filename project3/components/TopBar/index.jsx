import { React, useState, useEffect } from 'react';
import { AppBar, Checkbox, FormControlLabel, Toolbar, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import './styles.css';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import { getUserFromUrl } from '../../axiosAPI';
import useStore from '../../appStore';

function TopBar() {
  let advEnabled = useStore((s) => s.advEnabled);
  let set = useStore((s) => s.set);

  let location = useLocation();
  let navigate = useNavigate();

  let url = location.pathname;
  let { data: context, isLoading, error } = useQuery({
    queryKey: ['topbar', url],
    queryFn: () => getUserFromUrl(url),
  });

  if (isLoading) {
    context = "";
  }

  if (error) {
    console.error(error);
    context = "Could not get User data";
  }

  function toggleAdvEnabled() {
    set((prev) => {

      //toggle the button to reflect the current state
      const currIsAdvEnabled = !(prev.advEnabled);
      console.log("PHOTOSHARE New state:", currIsAdvEnabled);

      let path = window.location.pathname;
      let photoDetailRouteMatch = /^\/photos\/[a-z0-9]+\/[0-9]+/.exec(path);

      //if you're on a Photo Detail route currently, and the Advanced Features button got turned off
      //then redirect to the User Photos route
      if (photoDetailRouteMatch && !currIsAdvEnabled) {
        let userId = photoDetailRouteMatch[0].split('/')[2];
        navigate(`/photos/${userId}`)
      }
      else {
        let userPhotosRouteMatch = /^\/photos\/[a-z0-9]+/.exec(path);

        //if you're on the User Photos route, and the Advanced Features button got turned on
        //then redirect to the first User Details route
        if (userPhotosRouteMatch && currIsAdvEnabled) {
          let userId = userPhotosRouteMatch[0].split('/')[2];
          navigate(`/photos/${userId}/0`);
        }
      }
      
      let userCommentsRouteMatch = /^\/comments\/[a-zA-Z0-9]+/.exec(path);

      //if you're on the User Comments Route, and the button got turned off
      //then redirect to the users profile
      if (userCommentsRouteMatch && !currIsAdvEnabled) {
        let userId = userCommentsRouteMatch[0].split('/')[2];
        navigate(`/users/${userId}`);
      }

    return {advEnabled: currIsAdvEnabled};
    })
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

  //please forgive me for the following code
  

// TopBar.propTypes = {
//   advEnabled: PropTypes.bool.isRequired,
//   setAdvEnabled: PropTypes.func.isRequired
// };

export default TopBar;
