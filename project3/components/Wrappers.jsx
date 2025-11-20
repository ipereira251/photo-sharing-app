import UserDetail from './UserDetail';
import UserPhotos from './UserPhotos';
import PhotoDetail from './PhotoDetail';
import CommentDetail from './CommentDetail';
import PropTypes from 'prop-types';
import UserList from './UserList';
import { useParams } from 'react-router-dom';

export function UserDetailRoute({advEnabled}) {
  const { userId } = useParams();
  // eslint-disable-next-line no-console
  console.log('UserDetailRoute: userId is:', userId);
  return <UserDetail userId={userId} advEnabled={advEnabled} />;
}

export function UserPhotosRoute({ advEnabled, setAdvEnabled }) {
  const { userId } = useParams();
  return <UserPhotos userId={userId} advEnabled={advEnabled} setAdvEnabled={setAdvEnabled}/>;
}

export function PhotoDetailRoute({advEnabled, setAdvEnabled}){
  const { userId, index } = useParams();
  return <PhotoDetail userId={userId} initialIndex={index} advEnabled={advEnabled} setAdvEnabled={setAdvEnabled}/>;
}

export function CommentDetailRoute({advEnabled}){
  const { userId } = useParams();
  return <CommentDetail userId={userId} advEnabled={advEnabled}/>;
}

export function UserListRoute({advEnabled}){
  return <UserList advEnabled={advEnabled} />;
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