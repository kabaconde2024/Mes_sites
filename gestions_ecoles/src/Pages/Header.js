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
  ArrowDropDown
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

  const navLinks = [
    { label: 'Accueil', href: '/Accueil' },
    { label: 'Formation', href: '/Formation' },
    { label: 'Contact', href: '/Contact' },
    { 
      label: 'ISMG', 
      href: null,
      submenu: [
        { label: 'Présentation', action: handleInstitutionMenuClose },
        { label: 'Directeur', action: handleInstitutionMenuClose },
        { label: 'Secrétaire', action: handleInstitutionMenuClose }
      ]
    }
  ];

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
        {/* Logo (Left) */}
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600,
            whiteSpace: 'nowrap',
            mr: 4
          }}
        >
          EduManage
        </Typography>

        {/* Centered Navigation Links */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          flexGrow: 1
        }}>
          {navLinks.map((link, index) => (
            link.submenu ? (
              <Button
                key={index}
                color="inherit"
                sx={{ mx: 1 }}
                onClick={handleInstitutionMenuOpen}
                aria-controls="institution-menu"
                aria-haspopup="true"
                endIcon={<ArrowDropDown />}
              >
                {link.label}
              </Button>
            ) : (
              <Button
                key={index}
                color="inherit"
                sx={{ mx: 1 }}
                onClick={() => window.location.href = link.href}
              >
                {link.label}
              </Button>
            )
          ))}
        </Box>

        {/* Profile (Right) */}
        <Box>
          <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            <AccountCircle />
          </IconButton>
        </Box>

        {/* Institution Submenu */}
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
            {navLinks.find(link => link.label === 'ISMG')?.submenu.map((item, index) => (
              <MenuItem key={index} onClick={item.action}>
                {item.label}
              </MenuItem>
            ))}
          </MenuList>
        </Popover>

        {/* Profile Menu */}
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
      </Toolbar>
    </AppBar>
  );
};

export default Header;