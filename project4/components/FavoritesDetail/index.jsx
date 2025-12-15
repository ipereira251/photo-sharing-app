import React, { useState } from "react";
import './styles.css';
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { Card, List, ListItem, Modal, Typography, CardMedia, Tooltip } from "@mui/material";
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { fetchUserFavorites, removeUserFavorite } from "../../axiosAPI";
import useSessionStore from "../../store/sessionStore";

function FavoritesDetail(){
  let queryClient = useQueryClient();
  const currentUserId = useSessionStore((s) => s.userId);
  const [open, setOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const handleOpen = (favorite) => {
    setSelectedPhoto(favorite);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPhoto(null);
  };

  let {data: favorites, isLoading, error} = useQuery({
    queryKey: ['favorites', currentUserId], 
    queryFn: () => fetchUserFavorites(currentUserId)
  });

  let removeFavorite = useMutation({
    mutationFn: removeUserFavorite, 
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favorites', currentUserId] })
  });

  const handleRemoveClick = (favorite) => {
    console.log("clicked to remove", favorite, favorite.photo._id);
    removeFavorite.mutate(favorite.photo._id);
  };

  return (
    <>
    <List className="photo-list-container">
      {favorites && favorites.length > 0 ? (
        favorites.map(favorite => (favorite && favorite.photo && (
          <ListItem key={favorite.photo._id}>
            <Card className="photo-card-fav" onClick={() => handleOpen(favorite)}>
              <div className="photo-card-left">
                <div className="red-remove-circle-wrapper">
                  <Tooltip title="Remove from favorites">
                    <RemoveCircleIcon 
                      className="red-remove-circle" 
                      sx={{ color: 'red' }} 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveClick(favorite);
                      }} 
                    />
                  </Tooltip>
                </div>
                <CardMedia 
                  className="thumbnail-photo" 
                  component="img" 
                  image={`/images/${favorite.photo.file_name}`} 
                />
              </div>
              <div className="photo-card-right">
                <Typography variant="body2">Posted {new Date(favorite.photo.date_time).toLocaleString()}.</Typography>
                <Typography variant="body2">You favorited this image {new Date(favorite.favorited_at).toLocaleString()}.</Typography>
              </div>
            </Card>

          </ListItem>
        )))
      ) : (
        <Typography variant="body2">You haven&apos;t favorited any photos yet :(</Typography>
      )}
    </List>
    <Modal open={open} onClose={handleClose}>
        {selectedPhoto ? (
          <div className="modal-content"> 
            <Card className="photo-card">
              <CardMedia className="modal-photo" component="img" image={`/images/${selectedPhoto.photo.file_name}`} />
              <Typography variant="body2">Posted {new Date(selectedPhoto.photo.date_time).toLocaleString()}.</Typography>
              <Typography variant="body2">You favorited this image {new Date(selectedPhoto.favorited_at).toLocaleString()}.</Typography>              </Card>
          </div>
        ) : (
          <p>No photo selected</p>
        )}
    </Modal>
    </>
  );
}

export default FavoritesDetail;