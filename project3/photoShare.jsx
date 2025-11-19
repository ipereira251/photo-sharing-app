import { React, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Grid, Paper } from '@mui/material';
import {
  BrowserRouter, Route, Routes, useParams,
} from 'react-router-dom';

import './styles/main.css';
import TopBar from './components/TopBar';
import UserDetail from './components/UserDetail';
import UserList from './components/UserList';
import UserPhotos from './components/UserPhotos';
import PhotoDetail from './components/PhotoDetail';
import PropTypes from 'prop-types';
import CommentDetail from './components/CommentDetail';
import LoginRegister from './components/LoginRegister';

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
  const [advEnabled, setAdvEnabled] = useState(false);

  const toggleAdvEnabled = () => {
    setAdvEnabled((prev) => {
      const newState = !prev;
      console.log("PHOTOSHARE New state:", newState);
      return newState;
    });
  };

  return (
    <BrowserRouter>
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TopBar advEnabled={advEnabled} toggleAdvEnabled={toggleAdvEnabled}/>
          </Grid>
          <div className="main-topbar-buffer" />
          <Grid item sm={3}>
            <Paper className="main-grid-item">
              <UserList advEnabled={advEnabled}/>
            </Paper>
          </Grid>
          <Grid item sm={9}>
            <Paper className="main-grid-item">
              <Routes> 
                <Route path="/users/:userId" element={<UserDetailRoute advEnabled={advEnabled}/>} />
                <Route path="/photos/:userId" element={<UserPhotosRoute advEnabled={advEnabled}/>} />
                <Route path="/photos/:userId/:index" element={<PhotoDetailRoute advEnabled={advEnabled}/>} />
                <Route path="/comments/:userId" element={<CommentDetailRoute advEnabled={advEnabled}/>} />
                <Route path="/users" element={<UserListRoute advEnabled={advEnabled} />} />
                <Route path="/login" element={<LoginRegister />} />
              </Routes>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </BrowserRouter>
  );
}

UserDetailRoute.propTypes = {
  advEnabled: PropTypes.bool.isRequired
}

UserPhotosRoute.propTypes = {
  advEnabled: PropTypes.bool.isRequired
}

PhotoDetailRoute.propTypes = {
  advEnabled: PropTypes.bool.isRequired
}

CommentDetailRoute.propTypes = {
  advEnabled: PropTypes.bool.isRequired
}

UserListRoute.propTypes = {
  advEnabled: PropTypes.bool.isRequired
}

const root = ReactDOM.createRoot(document.getElementById('photoshareapp'));
root.render(<PhotoShare />);
