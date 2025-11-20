import { React, useState, useEffect } from 'react';
import { AppBar, Button, Checkbox, FormControlLabel, Toolbar, Typography } from '@mui/material';
import './styles.css';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useUIStore from '../../store/ui-store';
import useSessionStore from '../../store/session-store';

function TopBar() {
  const { advEnabled, toggleAdvEnabled } = useUIStore();
  const { loggedIn, firstName, clearSession } = useSessionStore();

  const [context, setContext] = useState("Home");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    getUserFromUrl(location.pathname);
  }, [location]);

  const getUserFromUrl = async (url) => {
    const terms = url.split("/");
    if(terms[1] && terms[2]){
      try {
        const response = await axios.get(`http://localhost:3001/user/${terms[2]}`, {
          withCredentials:true
        });
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

  const handleLogoutClick = async () => {
    console.log("Clicked topbar logout button");
    try{
      const response = await axios.post("http://localhost:3001/admin/logout", {}, {withCredentials:true});
      if(response){
        console.log("Successfully logged out");
        setContext("Home");
        clearSession();
        navigate("/login", { replace: true });
      }
    } catch (err){
      console.error("Couldn't log out.", err);
    }
  };

  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar className='topbar-toolbar'>
        
        {loggedIn && (
          <Typography variant="h5" color="inherit" className="topbar-name">
            Hi {firstName}
            {/* user's first name */}
          </Typography>
        )}

        {!loggedIn && (
          <Typography variant="h5" color="inherit" className="topbar-name">
            Please Log In
          </Typography>
        )}
      
        <FormControlLabel control={
          <Checkbox checked={advEnabled} onChange={toggleAdvEnabled} color="default" />
          } label="Advanced Features" />

        {/*display only when logged in */}
        {loggedIn &&
          <Button variant="contained" onClick={() => handleLogoutClick()}>Logout</Button>}

        {context && ((
          <Typography variant="h5">
            {context}
          </Typography>
        ))}
        
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;