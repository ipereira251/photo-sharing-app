import UserDetail from './UserDetail';
import UserPhotos from './UserPhotos';
import PhotoDetail from './PhotoDetail';
import CommentDetail from './CommentDetail';
import PropTypes from 'prop-types';
import UserList from './UserList';
import { useParams } from 'react-router-dom';

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

export function UserListRoute(){
  return <UserList />;
}

// UserDetailRoute.propTypes = {
//   advEnabled: PropTypes.bool.isRequired
// }

// UserPhotosRoute.propTypes = {
//   advEnabled: PropTypes.bool.isRequired
// }

// PhotoDetailRoute.propTypes = {
//   advEnabled: PropTypes.bool.isRequired
// }

// CommentDetailRoute.propTypes = {
//   advEnabled: PropTypes.bool.isRequired
// }

// UserListRoute.propTypes = {
//   advEnabled: PropTypes.bool.isRequired
// }