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
  Popover,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { 
  AccountCircle,
  ArrowDropDown,
  Menu as MenuIcon
} from '@mui/icons-material';

const Header = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [institutionAnchorEl, setInstitutionAnchorEl] = React.useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

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

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
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
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: { xs: 56, sm: 64 } }}>
        {/* Mobile Menu Toggle */}
        {isMobile && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open menu"
            onClick={handleMobileMenuToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Navigation Links (Left Side) */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {!isMobile ? (
            navLinks.map((link, index) => (
              link.submenu ? (
                <Button
                  key={index}
                  color="inherit"
                  sx={{ mx: { xs: 0.5, sm: 1 }, whiteSpace: 'nowrap' }}
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
                  sx={{ mx: { xs: 0.5, sm: 1 }, whiteSpace: 'nowrap' }}
                  onClick={() => window.location.href = link.href}
                >
                  {link.label}
                </Button>
              )
            ))
          ) : null}
        </Box>

        {/* Logo or App Name (Center on Desktop, Adjusted on Mobile) */}
        <Typography 
          variant="h6" 
          sx={{ 
            flexGrow: isMobile ? 1 : 0,
            fontWeight: 600,
            textAlign: { xs: 'center', sm: 'left' },
            mx: { xs: 0, sm: 2 },
            fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' }
          }}
        >
          EduManage
        </Typography>

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
              minWidth: { xs: 150, sm: 200 },
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

        {/* Mobile Drawer for Navigation */}
        <Drawer
          anchor="left"
          open={mobileMenuOpen}
          onClose={handleMobileMenuClose}
          sx={{
            '& .MuiDrawer-paper': {
              width: { xs: '70%', sm: '250px' },
              backgroundColor: '#2d3748',
              color: '#ffffff',
            }
          }}
        >
          <List>
            {navLinks.map((link, index) => (
              <ListItem 
                key={index} 
                button 
                onClick={() => {
                  if (link.href) window.location.href = link.href;
                  handleMobileMenuClose();
                }}
                sx={{ 
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                  py: 1,
                  px: 2
                }}
              >
                <ListItemText 
                  primary={link.label} 
                  primaryTypographyProps={{ 
                    fontSize: { xs: '0.9rem', sm: '1rem' }
                  }}
                />
                {link.submenu && (
                  <IconButton 
                    size="small" 
                    onClick={handleInstitutionMenuOpen}
                    sx={{ ml: 1 }}
                  >
                    <ArrowDropDown />
                  </IconButton>
                )}
              </ListItem>
            ))}
          </List>
        </Drawer>

        {/* Profile Menu (Right Side) */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
              },
              fontSize: { xs: '1.5rem', sm: '1.75rem' }
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
                },
                minWidth: { xs: 150, sm: 200 },
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