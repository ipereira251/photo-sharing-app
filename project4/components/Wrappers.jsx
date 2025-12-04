import React from 'react';
import { useParams } from 'react-router-dom';
import UserDetail from './UserDetail';
import UserPhotos from './UserPhotos';
import PhotoDetail from './PhotoDetail';
import CommentDetail from './CommentDetail';

export function UserDetailRoute() {
  const { userId } = useParams();
  // eslint-disable-next-line no-console
  console.log('UserDetailRoute: userId is:', userId);
  return <UserDetail userId={userId}/>;
}

export function UserPhotosRoute() {
  const { userId } = useParams();
  return <UserPhotos userId={userId}/>;
}

export function PhotoDetailRoute(){
  const { userId, index } = useParams();
  return <PhotoDetail userId={userId} initialIndex={index} />;
}

export function CommentDetailRoute(){
  const { userId } = useParams();
  return <CommentDetail userId={userId}/>;
}


