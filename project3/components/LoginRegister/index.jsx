import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, IconButton, InputAdornment, TextField } from "@mui/material";
// eslint-disable-next-line import/no-extraneous-dependencies
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import useSessionStore from "../../store/session-store";

function LoginRegister(){
  const navigate = useNavigate();
  const {loggedIn, setSession, clearSession} = useSessionStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [errors, setErrors] = useState({
    username: '', 
    password: ''
  });
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    if(loggedIn){
      navigate("/", {replace:true});
    }
  }, [loggedIn, navigate]);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const validate = () => {
    const newErrors = {
      username: '',
      password: ''
    };
    if(!username.trim()){
      newErrors.username = "Username is required";
    }
    if(!password.trim()){
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
        const response = await axios.post('http://localhost:3001/admin/login', {username, password}, {withCredentials:true});
        if(response){
          console.log("Response from /admin/login", response);
        }
        if(response.data.success){ 
          console.log("updating zustand session");
          setSession({username: response.data.username, firstName: response.data.firstName });
          navigate(`/users/${response.data.id}`);
        }
        console.log("Logging in as", username);
      } catch (err){
        clearSession();
        setApiError("Invalid username or password. Try again.");
        setPassword("");
        console.error(err);
      }
      
    } else {
      console.log("Errors in form");
    }
  };

  return (
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

      {apiError && <p style={{ color: "red"}}>{apiError}</p>}

      <Button type="submit" variant="contained" fullWidth>
        Log In
      </Button>
    </form>    
  );
}   

export default LoginRegister;