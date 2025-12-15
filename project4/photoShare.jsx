import React from 'react';
import ReactDOM from 'react-dom/client';
import { Grid, Paper } from '@mui/material';
import {
  BrowserRouter, Route, Routes,
} from 'react-router-dom';
import {  
  QueryClient, QueryClientProvider, useQuery
} from '@tanstack/react-query';
import './styles/main.css';
import TopBar from './components/TopBar';
import UserList from './components/UserList';
import LoginRegister from './components/LoginRegister';
import { UserDetailRoute, UserPhotosRoute, PhotoDetailRoute, CommentDetailRoute } from './components/Wrappers';
import useSessionStore from './store/sessionStore';
import { fetchSession } from './axiosAPI';
import FavoritesDetail from './components/FavoritesDetail';

const queryClient = new QueryClient();

function PhotoShare() {
  const { setSession, clearSession } = useSessionStore();
  let loggedIn = useSessionStore((s) => s.loggedIn);

  const { data, error, isLoading, isError } = useQuery({
    queryKey: ['session'],
    queryFn: () => fetchSession(),
    retry: false
  });

  if(data){
    console.log("Data:", data);
    if(!loggedIn){
      console.log("Setting session data");
      setSession({
        username: data.username,
        firstName: data.firstName,
      });
      console.log("initializing");
      useSessionStore.getState().initSession();
    }
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
                {loggedIn ? <UserList /> : <></>}
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
                  <Route path="/login" element={<LoginRegister register={false} />} />
                  <Route path="/register" element={<LoginRegister register={true} />} />
                  <Route path="/favorites" element={<FavoritesDetail />} />
                </Routes>
              </Paper>
            </Grid>
          </Grid>
        </div>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('photoshareapp'));
root.render(
  <QueryClientProvider client={queryClient}>
     <PhotoShare />
  </QueryClientProvider>
 
);