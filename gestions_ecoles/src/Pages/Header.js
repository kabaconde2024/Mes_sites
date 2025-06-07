import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Menu, 
  MenuItem, 
  Box,
  Button,
  MenuList,
  Popover
} from '@mui/material';
import { 
  AccountCircle,
  ArrowDropDown // Nouvelle icône ajoutée
} from '@mui/icons-material';

const Header = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [institutionAnchorEl, setInstitutionAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleInstitutionMenuOpen = (event) => {
    setInstitutionAnchorEl(event.currentTarget);
  };

  const handleInstitutionMenuClose = () => {
    setInstitutionAnchorEl(null);
  };

  const institutionOpen = Boolean(institutionAnchorEl);

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: '#2d3748',
        color: '#ffffff',
        boxShadow: 'none',
      }}
    >
      <Toolbar>
        {/* Logo ou Nom de l'application */}
        <Typography variant="h6" sx={{ 
          flexGrow: 1,
          fontWeight: 600,
        }}>
          EduManage
        </Typography>

        {/* Menus alignés à droite */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Menu Accueil */}
          <Button
            color="inherit"
            sx={{ mx: 1 }}
            onClick={() => window.location.href = '/Accueil'}
          >
            Accueil
          </Button>

          {/* Menu Formation */}
          <Button
            color="inherit"
            sx={{ mx: 1 }}
            onClick={() => window.location.href = '/Formation'}
          >
            Formation
          </Button>

          {/* Menu Contact */}
          <Button
            color="inherit"
            sx={{ mx: 1 }}
            onClick={() => window.location.href = '/Contact'}
          >
            Contact
          </Button>

          {/* Menu Institution ISMG avec icône */}
          <Button
            color="inherit"
            sx={{ mx: 1 }}
            onClick={handleInstitutionMenuOpen}
            aria-controls="institution-menu"
            aria-haspopup="true"
            endIcon={<ArrowDropDown />} // Icône ajoutée ici
          >
            ISMG
          </Button>
          
          <Popover
            id="institution-menu"
            open={institutionOpen}
            anchorEl={institutionAnchorEl}
            onClose={handleInstitutionMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            PaperProps={{
              sx: {
                backgroundColor: '#3c4a5e',
                color: '#ffffff',
                minWidth: 200,
              }
            }}
          >
            <MenuList>
              <MenuItem onClick={handleInstitutionMenuClose}>
                Présentation
              </MenuItem>
              <MenuItem onClick={handleInstitutionMenuClose}>
                Directeur
              </MenuItem>
              <MenuItem onClick={handleInstitutionMenuClose}>
                Secrétaire
              </MenuItem>
            </MenuList>
          </Popover>

          {/* Menu Profil */}
          <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
            sx={{
              ml: 2,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            PaperProps={{
              sx: {
                backgroundColor: '#3c4a5e',
                color: '#ffffff',
                '& .MuiMenuItem-root': {
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }
              }
            }}
          >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;