import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, FormControl, IconButton, InputAdornment, InputLabel, Input, Paper, Grid, TextField } from "@mui/material";
import { TrySharp, Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import useSessionStore from "../../store/session-store";

function LoginRegister(){
  const navigate = useNavigate();
  const setSession = useSessionStore((state) => state.setSession);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [errors, setErrors] = useState({
    username: '', 
    password: ''
  });

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const validate = () => {
    const newErrors = {
      username: '',
      password: ''
    };
    if(!username){
      newErrors.username = "Username is required";
    }
    if(!password){
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return !newErrors.username && !newErrors.password;
  };

  const handleSubmit = async (e) => {
    console.log("in handle submit");
    e.preventDefault();
    if(validate()){
      ///actual log in attempt
      try{
        console.log("calling /admin/login");
        const response = await axios.post('http://localhost:3001/admin/login', {username:"admin", password:"admin"}, {withCredentials:true});
        if(response){
          console.log("Response from /admin/login", response);
        }
      } catch (err){
        console.error(err);
      }
      if(username === "admin" && password === "admin"){ //update for users
        console.log("updating zustand session");
        setSession({ loggedIn: true,  username: "admin", firstName: "Admin" });
        navigate('/');
      }
      console.log("Logging in as", username);
    } else {
      console.log("Errors in form");
    }
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ minHeight: '100vh' }}>
      <Grid item xs={12} sm={6} md={4}>
        
          <form onSubmit={handleSubmit}>
            <TextField 
              fullWidth 
              label="Username"
              variant="outlined"
              onChange={handleUsernameChange}
              error={!!errors.username}
              helperText={errors.username}
              style={{ marginBottom: '20px' }}
            />

            <TextField
              label="Password"
              fullWidth
              variant="outlined"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handlePasswordChange}
              error={!!errors.password} 
              helperText={errors.password} 
              style={{ marginBottom: '20px' }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      onClick={handleClickShowPassword}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button type="submit" variant="contained" fullWidth>
              Log In
            </Button>

          </form>
          
      </Grid>
    </Grid>
  );
}   

export default LoginRegister;