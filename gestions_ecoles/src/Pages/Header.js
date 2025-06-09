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
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
            mr: { xs: 0, md: 4 }
          }}
        >
          EduManage
        </Typography>

        {/* Mobile Menu Button */}
        {isMobile && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleMobileMenuToggle}
            sx={{ ml: 'auto', mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Centered Navigation (Desktop) */}
        {!isMobile && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            flexGrow: 1,
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)'
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
        )}

        {/* Profile (Right) */}
        <Box sx={{ marginLeft: 'auto' }}>
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

        {/* Mobile Menu */}
        <Menu
          anchorEl={mobileMenuOpen ? document.body : null}
          open={isMobile && mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          PaperProps={{
            sx: {
              width: '100%',
              maxWidth: 'none',
              backgroundColor: '#2d3748',
              color: '#ffffff',
              mt: '56px',
              borderRadius: 0,
              boxShadow: 'none'
            }
          }}
          MenuListProps={{
            sx: {
              padding: 0
            }
          }}
        >
          {navLinks.map((link, index) => (
            <MenuItem 
              key={index}
              onClick={() => {
                if (link.href) window.location.href = link.href;
                setMobileMenuOpen(false);
              }}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              {link.label}
              {link.submenu && <ArrowDropDown sx={{ ml: 1 }} />}
            </MenuItem>
          ))}
        </Menu>

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