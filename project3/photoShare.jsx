import { React, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Grid, Paper } from '@mui/material';
import {
  BrowserRouter, Route, Routes, useParams,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import './styles/main.css';
import TopBar from './components/TopBar';
import UserDetail from './components/UserDetail';
import UserList from './components/UserList';
import UserPhotos from './components/UserPhotos';
import PhotoDetail from './components/PhotoDetail';
import CommentDetail from './components/CommentDetail';

function UserDetailRoute({advEnabled}) {
  const { userId } = useParams();
  // eslint-disable-next-line no-console
  console.log('UserDetailRoute: userId is:', userId);
  return <UserDetail userId={userId} advEnabled={advEnabled} />;
}

function UserPhotosRoute({advEnabled}) {
  const { userId } = useParams();
  return <UserPhotos userId={userId} advEnabled={advEnabled}/>;
}

function UserListRoute({advEnabled}){
  return <UserList advEnabled={advEnabled} />;
}

function PhotoDetailRoute({advEnabled}){
  const { userId, photoId } = useParams();
  return <PhotoDetail userId={userId} photoId={photoId} advEnabled={advEnabled}/>;
}

function CommentDetailRoute({advEnabled}){
  const { userId } = useParams();
  return <CommentDetail userId={userId} advEnabled={advEnabled}/>;
}

function PhotoShare() {

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
                <Route path="/users" element={<UserListRoute />} />
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
