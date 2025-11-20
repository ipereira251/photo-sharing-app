import { React, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Grid, Paper } from '@mui/material';
import {
  BrowserRouter, Route, Routes, useParams,
} from 'react-router-dom';
import axios from 'axios';

import './styles/main.css';
import TopBar from './components/TopBar';
import UserDetail from './components/UserDetail';
import UserList from './components/UserList';
import UserPhotos from './components/UserPhotos';
import PhotoDetail from './components/PhotoDetail';
import CommentDetail from './components/CommentDetail';
import LoginRegister from './components/LoginRegister';

import useSessionStore from './store/session-store';

function UserDetailRoute({advEnabled}) {
  const { userId } = useParams();
  // eslint-disable-next-line no-console
  console.log('UserDetailRoute: userId is:', userId);
  return <UserDetail userId={userId} advEnabled={advEnabled} />;
}

function UserPhotosRoute() {
  const { userId } = useParams();
  return <UserPhotos userId={userId} />;
}

function PhotoDetailRoute(){
  const { userId, photoId } = useParams();
  return <PhotoDetail userId={userId} photoId={photoId} />;
}

function CommentDetailRoute(){
  const { userId } = useParams();
  return <CommentDetail userId={userId} />;
}

function PhotoShare() {
  const { setSession, clearSession } = useSessionStore();

  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log("trying session");
        const response = await axios.get("http://localhost:3001/session", {withCredentials: true});
        if(response.data){
          setSession({username: response.data.username, firstName: response.data.firstName });
          console.log("Setting session", response.data.username, response.data.firstName);
        } else {
          clearSession();
        }
      } catch (err){
        console.error("Failed session check", err);
        clearSession();
      }
    };

    checkSession();
  }, []);

  return (
    <BrowserRouter>
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TopBar />
          </Grid>
          <div className="main-topbar-buffer" />
          <Grid item sm={3}>
            <Paper className="main-grid-item">
              <UserList />
            </Paper>
          </Grid>
          <Grid item sm={9}>
            <Paper className="main-grid-item">
              <Routes> 
                <Route path="/users/:userId" element={<UserDetailRoute />} />
                <Route path="/photos/:userId" element={<UserPhotosRoute />} />
                <Route path="/photos/:userId/:index" element={<PhotoDetailRoute />} />
                <Route path="/comments/:userId" element={<CommentDetailRoute />} />
                <Route path="/users" element={<UserList />} />
                <Route path="/login" element={<LoginRegister />} />
              </Routes>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('photoshareapp'));
root.render(<PhotoShare />);
