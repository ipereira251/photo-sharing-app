import { React, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Grid, Paper } from '@mui/material';
import {
  BrowserRouter, Route, Routes,
  useNavigate,
} from 'react-router-dom';
import {  
  QueryClient, QueryClientProvider 
} from '@tanstack/react-query';

import './styles/main.css';
import TopBar from './components/TopBar';
import UserList from './components/UserList';

import { UserDetailRoute, UserPhotosRoute, UserListRoute, PhotoDetailRoute, CommentDetailRoute } from './components/Wrappers';

const queryClient = new QueryClient();

function PhotoShare() {

  return (
    <BrowserRouter>   
      <QueryClientProvider client={queryClient}>
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
                  <Route path="/users" element={<UserListRoute  />} />
                </Routes>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('photoshareapp'));
root.render(<PhotoShare />);
