import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
// eslint-disable-next-line import/no-extraneous-dependencies
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import useSessionStore from "../../store/session-store";

function LoginRegister({register}){
  const navigate = useNavigate();
  const {loggedIn, setSession, clearSession} = useSessionStore();
  const [formData, setFormData] = useState({
    firstName: '', 
    lastName: '', 
    username: '',
    password1: '', 
    password2: '', 
    location: '', 
    occupation: '', 
    description: ''
  });
  const [showPassword, setShowPassword] = React.useState(false);
  const [errors, setErrors] = useState({
    firstName: '', 
    lastName: '', 
    username: '', 
    password1: '', 
    password2: '', 
    location: '', 
    occupation: '', 
    description: ''
  });
  const [apiError, setApiError] = useState('');
  const [onRegister, setOnRegister] = useState(register);

  useEffect(() => {
    if(loggedIn){
      navigate("/", {replace:true});
    }
    if(onRegister){
      navigate("/register", {replace:true});
    }
  }, [loggedIn, navigate]);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const clearFormData = () => {
    setFormData({
      firstName: '',
      lastName: '',
      username: '',
      password1: '',
      password2: '',
      location: '',
      occupation: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev, [name]: value
    }));
    setErrors((prev) => ({
      ...prev, [name]: ""
    }));
    setApiError('');
  };

  const validateLogin = () => {
    const newErrors = {
      username: '',
      password: ''
    };

    //all required fields filled?
    if(!formData.username.trim()){
      newErrors.username = "Username is required";
    }
    if(!formData.password1.trim()){
      newErrors.password1 = "Password is required";
    }

    setErrors(newErrors);
    return !newErrors.username && !newErrors.password1;
  };

  const handleLogin = async () => {
    if(validateLogin()){
      try{
        console.log("calling /admin/login");
        const response = await axios.post('http://localhost:3001/admin/login', 
          {username: formData.username, password: formData.password1}, 
          {withCredentials:true});
        if(response){
          console.log("Response from /admin/login", response);
        }
        if(response.data.success){ 
          console.log("updating zustand session");
          setSession({username: response.data.username, firstName: response.data.firstName });
          navigate(`/users/${response.data.id}`);
        }
      } catch (err){
        clearSession();
        setApiError("Invalid username or password. Try again.");
        setFormData((prev) => ({
          ...prev, password1: ""
        }));
        console.error(err);
      }
      
    } else {
      console.log("Errors in login form"); //nothing else, don't need to involve server
    }
  };

  const validateRegistration = () => {
    const newErrors = {
      firstName: '', 
      lastName: '',
      username: '', 
      password1: '', 
      password2: '', 
      location: '', //these not needed for now, possibly in part 4
      occupation: '', 
      description: ''
    };

    //all required fields filled?
    if(!formData.firstName.trim()){
      newErrors.firstName = "First name field is required.";
    }
    if(!formData.lastName.trim()){
      newErrors.lastName = "Last name field is required.";
    }
    if(!formData.username.trim()){
      newErrors.username = "Username is required.";
    }
    if(!formData.password1.trim()){
      newErrors.password1 = "Password is required.";
    }
    if(!formData.password2.trim()){
      if(!formData.password1.trim()){
        newErrors.password2 = "Password is required.";
      } else {
        newErrors.password2 = "Must confirm password.";
      }
    }

    //do passwords match?
    if(formData.password1 && formData.password2){
      if(formData.password1 !== formData.password2){
        newErrors.password2 = "Password does not match";
      }
    }
    setErrors(newErrors);
    const hasErrors = Object.values(newErrors).some((error) => error !== '');
    console.log("Found errors:", hasErrors);
    return !hasErrors; 
  };

  const handleRegistration = async () => {
    if(validateRegistration()){
      try{
        //axios
        console.log("Calling /user");
        const response = await axios.post('http://localhost:3001/user', 
          {}, 
          {withCredentials: true});
        if(response){
          console.log("Response from /user", response);
        }
        if(response.data.success){
          setSession({username: response.data.username, firstName: response.data.firstName});
          navigate(`/users/${response.data.id}`);
        } else {
          //is username already taken?

        }
        
      } catch (err){
        clearSession();
        //username taken?
        setFormData((prev) => ({
          ...prev, password1: "", password2: ""
        }));
        console.error(err);
      }
    } else {
      console.log("Errors in registration form");
    }
  };

  const handleFormSubmit = async (e) => {
    console.log("in handle submit");
    e.preventDefault();
    if(!onRegister){
      handleLogin();
    } else {
      handleRegistration();
    }
  };

  const handleOnRegisterToggle = () => {
    setOnRegister(prev => !prev);
    setApiError("");
    clearFormData();
    console.log("On register", onRegister);
    if(onRegister === false){
      console.log("Nav to register");
      navigate('/register');
    } else {
      console.log("Nav to register");
      navigate('/login');
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>

      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        {onRegister ? "Register" : "Login"}
      </Typography>
      
      {/* first and last name */}
      {onRegister && (
        <>
          <TextField
            label="First Name"
            name="firstName"
            value={formData.firstName}
            variant="outlined"
            onChange={handleInputChange}
            error={!!errors.firstName}
            helperText={errors.firstName}
            style={{ marginBottom: '20px', width: '50%' }}
          />

          <TextField
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            variant="outlined"
            onChange={handleInputChange}
            error={!!errors.lastName}
            helperText={errors.lastName}
            style={{ marginBottom: '20px', width: '50%' }}
          />
        </>
      )}

      <TextField 
        fullWidth 
        name="username"
        value={formData.username}
        label="Username"
        variant="outlined"
        onChange={handleInputChange}
        error={!!errors.username}
        helperText={errors.username}
        style={{ marginBottom: '20px' }}
      />

      <TextField
        label="Password"
        fullWidth
        name="password1"
        value={formData.password1}
        variant="outlined"
        type={showPassword ? "text" : "password"}
        onChange={handleInputChange}
        error={!!errors.password1} 
        helperText={errors.password1} 
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

    {/* additional password, location, description, occupation*/}
      {onRegister && (
       <>
          <TextField
            label="Confirm Password"
            fullWidth
            name="password2"
            value={formData.password2}
            variant="outlined"
            type={showPassword ? "text" : "password"}
            onChange={handleInputChange}
            error={!!errors.password2} 
            helperText={errors.password2} 
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

          <TextField 
            label="Location"
            fullWidth
            name="location"
            value={formData.location}
            variant="outlined"
            onChange={handleInputChange}
            error={!!errors.location}
            helperText={errors.location}
            style={{ marginBottom: '20px' }}
          />

          <TextField 
            label="Occupation"
            fullWidth
            name="occupation"
            value={formData.occupation}
            variant="outlined"
            onChange={handleInputChange}
            error={!!errors.occupation}
            helperText={errors.occupation}
            style={{ marginBottom: '20px' }}
          />

          <TextField 
            label="Description"
            fullWidth
            multiline
            rows={3}
            name="description"
            value={formData.description}
            variant="outlined"
            onChange={handleInputChange}
            error={!!errors.description}
            helperText={errors.description}
            style={{ marginBottom: '20px' }}
          />

       </>
      )}

      {apiError && (
        <Typography color="#C82909" sx={{ marginBottom: 2 }}>
          {apiError}
        </Typography>
      )}

      <Button type="submit" variant="contained" fullWidth>
        {onRegister ? "Register Me" : "Log In"}
      </Button>

      <Typography align="center" sx={{marginTop: 2}}>
        {onRegister ? "Already have an account?" : "Don't have an account?"}
      </Typography>

      {/* toggle register here */}
      <Button 
        fullWidth
        variant="text"
        onClick={() => handleOnRegisterToggle()}>
          {onRegister ? "Back to Login" : "Register"}
      </Button>
    </form>    
  );
}   

export default LoginRegister;