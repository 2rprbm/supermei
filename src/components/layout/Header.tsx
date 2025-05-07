import { useState } from 'react'
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useScrollTrigger,
  Slide,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Business as BusinessIcon,
  Close as CloseIcon,
} from '@mui/icons-material'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface HeaderProps {
  onMenuToggle: () => void
  isMenuOpen: boolean
}

// Componente para esconder o header quando rolar para baixo
function HideOnScroll({ children }: { children: React.ReactElement }) {
  const trigger = useScrollTrigger()
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  )
}

export default function Header({ onMenuToggle, isMenuOpen }: HeaderProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const router = useRouter()

  const handleNavigation = (path: string) => {
    router.push(path)
    if (isMobile) {
      onMenuToggle()
    }
  }

  return (
    <HideOnScroll>
      <AppBar 
        position="fixed" 
        sx={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 4 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              edge="start"
              color="primary"
              aria-label="menu"
              onClick={onMenuToggle}
              sx={{ 
                '&:hover': { 
                  backgroundColor: 'rgba(25, 118, 210, 0.08)',
                  transform: isMenuOpen ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.3s ease-in-out',
                }
              }}
            >
              <MenuIcon />
            </IconButton>
            
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer',
                '&:hover': { opacity: 0.8 }
              }}
              onClick={() => handleNavigation('/home')}
            >
              <BusinessIcon 
                sx={{ 
                  fontSize: 32, 
                  color: 'primary.main',
                  mr: 1
                }} 
              />
              <Typography
                variant="h6"
                component="h1"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                SuperMEI
              </Typography>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
    </HideOnScroll>
  )
} 