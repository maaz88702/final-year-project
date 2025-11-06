import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Favorite as FavoriteIcon } from '@mui/icons-material'; // Import an icon

function SimpleMuiCard() {
  // Simple state to demonstrate interaction
  const [likes, setLikes] = React.useState(0);

  const handleLike = () => {
    setLikes(likes + 1);
  };

  return (
    // 1. Box: A core layout component (like a div) with built-in styling props
    <Box 
      sx={{ 
        maxWidth: 300, 
        padding: 3, 
        margin: '50px auto', 
        border: '1px solid #e0e0e0',
        borderRadius: '8px', 
        boxShadow: 3 
      }}
    >
      
     
      <Typography variant="h5" component="div" gutterBottom>
        MUI Starter Card
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        This component uses Material-UI for styling and layout. It's built with 
        **Box**, **Typography**, and a functional **Button**.
      </Typography>
      
     
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleLike}
        startIcon={<FavoriteIcon />} // Add an icon from the @mui/icons-material package
      >
        Like ({likes})
      </Button>

    </Box>
  );
}

export default SimpleMuiCard;