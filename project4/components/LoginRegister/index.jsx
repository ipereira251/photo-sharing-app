import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
// eslint-disable-next-line import/no-extraneous-dependencies
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import useSessionStore from "../../store/sessionStore";

function LoginRegister({register}){
  const navigate = useNavigate();
  const {loggedIn, setSession, clearSession} = useSessionStore();
  const [formData, setFormData] = useState({
    first_name: '', 
    last_name: '', 
    login_name: '',
    password: '', 
    password2: '', 
    location: '', 
    occupation: '', 
    description: '',
  });
  const [showPassword, setShowPassword] = React.useState(false);
  const [errors, setErrors] = useState({
    first_name: '', 
    last_name: '', 
    login_name: '', 
    password: '', 
    password2: '', 
    location: '', 
    occupation: '', 
    description: '',
  });
  const [apiError, setApiError] = useState('');
  const [onRegister, setOnRegister] = useState(register);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const clearFormData = () => {
    setFormData({
      first_name: '',
      last_name: '',
      login_name: '',
      password: '',
      password2: '',
      location: '',
      occupation: '',
      description: '',
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
      login_name: '',
      password: ''
    };

    //all required fields filled?
    if(!formData.login_name.trim()){
      newErrors.login_name = "Username is required";
    }
    if(!formData.password.trim()){
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return !newErrors.login_name && !newErrors.password;
  };

  const handleLogin = async () => {
    if(validateLogin()){
      try{
        console.log("calling /admin/login");
        const response = await axios.post('http://localhost:3001/admin/login', 
          {login_name: formData.login_name, password: formData.password}, 
          {withCredentials:true});
        if(response){
          console.log("Response from /admin/login", response);
        }
        if(response.data.success){ 
          console.log("updating zustand session");
          console.log(response.data.first_name);

          setSession({username: response.data.user.username, firstName: response.data.first_name, userId: response.data._id });
          navigate(`/users/${response.data._id}`);
        }
      } catch (err){
        clearSession();
        setApiError("Invalid username or password. Try again.");
        setFormData((prev) => ({
          ...prev, password: ""
        }));
        console.error(err);
      }
      
    } else {
      console.log("Errors in login form"); //nothing else, don't need to involve server
    }
  };

  const validateRegistration = () => {
    const newErrors = {
      first_name: '', 
      last_name: '',
      login_name: '', 
      password: '', 
      password2: '', 
      location: '', //these not needed for now, possibly in part 4
      occupation: '', 
      description: ''
    };

    //all required fields filled?
    if(!formData.first_name.trim()){
      newErrors.first_name = "First name field is required.";
    }
    if(!formData.last_name.trim()){
      newErrors.last_name = "Last name field is required.";
    }
    if(!formData.login_name.trim()){
      newErrors.login_name = "Username is required.";
    }
    if(!formData.password.trim()){
      newErrors.password = "Password is required.";
    }
    if(!formData.password2.trim()){
      if(!formData.password.trim()){
        newErrors.password2 = "Password is required.";
      } else {
        newErrors.password2 = "Must confirm password.";
      }
    }

    //do passwords match?
    if(formData.password && formData.password2){
      if(formData.password !== formData.password2){
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
          {formData}, 
          {withCredentials: true});
        if(response){
          console.log("Response from /user", response);
        }
        if(response.status === 201 || response.status === 200){
          console.log("201 status", response);
          setSession({username: response.data.username, firstName: response.data.first_name});
          navigate(`/users/${response.data.id}`);
        }
        
      } catch (err){
        if(err.status === 409){
          setErrors((prev) => ({
            ...prev, login_name: "Username already in use."
          }));
        }
        clearSession();
        setFormData((prev) => ({
          ...prev, password: "", password2: ""
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
    setErrors("");
    console.log("On register", onRegister);
    if(onRegister === false){
      navigate('/register');
    } else {
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
            name="first_name"
            value={formData.first_name}
            variant="outlined"
            onChange={handleInputChange}
            error={!!errors.first_name}
            helperText={errors.first_name}
            style={{ marginBottom: '20px', width: '50%' }}
          />

          <TextField
            label="Last Name"
            name="last_name"
            value={formData.last_name}
            variant="outlined"
            onChange={handleInputChange}
            error={!!errors.last_name}
            helperText={errors.last_name}
            style={{ marginBottom: '20px', width: '50%' }}
          />
        </>
      )}

      <TextField 
        fullWidth 
        name="login_name"
        value={formData.login_name}
        label="Username"
        variant="outlined"
        onChange={handleInputChange}
        error={!!errors.login_name}
        helperText={errors.login_name}
        style={{ marginBottom: '20px' }}
      />

      <TextField
        label="Password"
        fullWidth
        name="password"
        value={formData.password}
        variant="outlined"
        type={showPassword ? "text" : "password"}
        onChange={handleInputChange}
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