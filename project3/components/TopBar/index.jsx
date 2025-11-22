import React, { useEffect, useRef } from 'react';
import { AppBar, Button, Checkbox, FormControlLabel, Toolbar, Typography } from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import './styles.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { getUserFromUrl } from '../../axiosAPI';
import useStore from '../../store/appStore';
import useSessionStore from '../../store/sessionStore';

function TopBar() {
  let queryClient = useQueryClient();
  let {advEnabled} = useStore();
  let {loggedIn, firstName, clearSession} = useSessionStore();
  let set = useStore((s) => s.set);
  let userId = useSessionStore(s => s.userId);

  let location = useLocation();
  let navigate = useNavigate();

  const uploadInputRef = useRef(null);

  let url = location.pathname;
  let { data: context, isLoading, error } = useQuery({
    queryKey: ['topbar', url],
    queryFn: () => getUserFromUrl(url),
    enabled: loggedIn
  });

  useEffect(() => {
    if(!loggedIn){
      navigate('/login');
    }
  }, []);

  if (error) {
    console.error(error);
    context = "Could not get User data";
  }

  const handleLogoutClick = async () => {
    console.log("Clicked topbar logout button");
    try{
      const response = await axios.post("http://localhost:3001/admin/logout", {}, {withCredentials:true});
      if(response){
        console.log("Successfully logged out");
        //setContext("Home");
        clearSession();
        navigate("/login", { replace: true });
      }
    } catch (err){
      console.error("Couldn't log out.", err);
    }
  };

  function handleUpload() {
    const file = uploadInputRef.current.files[0];
    console.log(file);
    const domForm = new FormData();
    domForm.append("uploadedphoto", file);
    axios.post('http://localhost:3001/photos/new', domForm, {withCredentials: true})
    .then((res) => {
      queryClient.invalidateQueries({ queryKey: ['photos', userId] });
      navigate(`/photos/${userId}`);

      uploadInputRef.current.value = "";
      console.log(res);
    })
    .catch((err) => console.log(`POST ERR: ${err}`));
  }

  //please forgive me for the following code
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
        navigate(`/photos/${userId}`);
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
    });
  }

  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar className='topbar-toolbar'>

        {loggedIn && (
          <>
            <Typography variant="h5" color="inherit" className="topbar-name">
              Hi {firstName}
            </Typography>   {/* toggle or toggleAdvEnabled both? vv */}
            <FormControlLabel control={
              <Checkbox checked={advEnabled} onChange={() => toggleAdvEnabled()} color="default" /> 
              } label="Advanced Features" />
            <Button variant="contained" onClick={() => handleLogoutClick()}>Logout</Button>
          </>
        )}

      {loggedIn &&
        <>
          <input type="file" accept="image/*" ref={uploadInputRef}/>
          <Button variant="contained" onClick={() => handleUpload()}>Upload Photo</Button>
        </>
      }
        {!loggedIn && (
          <Typography variant="h5" color="inherit" className="topbar-name">
            Please Sign In
          </Typography>
        )}


        {context && (
          <Typography variant="h5">
            {context}
          </Typography>
        )}
        
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
