import { useParams } from 'react-router-dom';

export function UserDetailRoute({advEnabled}) {
  const { userId } = useParams();
  // eslint-disable-next-line no-console
  console.log('UserDetailRoute: userId is:', userId);
  return <UserDetail userId={userId} advEnabled={advEnabled} />;
}

export function UserPhotosRoute({advEnabled}) {
  const { userId } = useParams();
  return <UserPhotos userId={userId} advEnabled={advEnabled}/>;
}

export function UserListRoute({advEnabled}){
  return <UserList advEnabled={advEnabled} />;
}

export function PhotoDetailRoute({advEnabled}){
  const { userId, photoId } = useParams();
  return <PhotoDetail userId={userId} photoId={photoId} advEnabled={advEnabled}/>;
}

export function CommentDetailRoute({advEnabled}){
  const { userId } = useParams();
  return <CommentDetail userId={userId} advEnabled={advEnabled}/>;
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