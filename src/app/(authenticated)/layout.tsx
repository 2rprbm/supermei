'use client'

import { useState, useEffect } from 'react'
import { Box, useTheme, useMediaQuery } from '@mui/material'
import Header from '@/components/layout/Header'
import Sidebar from '@/components/layout/Sidebar'
import Footer from '@/components/layout/Footer'

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(true)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  useEffect(() => {
    const savedMenuState = localStorage.getItem('menuOpen')
    if (savedMenuState !== null) {
      setIsMenuOpen(savedMenuState === 'true')
    }
  }, [])

  const handleMenuToggle = () => {
    const newState = !isMenuOpen
    setIsMenuOpen(newState)
    localStorage.setItem('menuOpen', String(newState))
  }

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      <Header onMenuToggle={handleMenuToggle} isMenuOpen={isMenuOpen} />
      
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          pt: { xs: 8, sm: 9 }, // Espaço para o header
          position: 'relative',
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...(isMenuOpen && !isMobile && {
            width: `calc(100% - ${280}px)`,
            marginLeft: `${280}px`,
            transition: theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.easeOut,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }),
        }}
      >
        <Sidebar open={isMenuOpen} onClose={() => {
          setIsMenuOpen(false)
          localStorage.setItem('menuOpen', 'false')
        }} />
        
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: '100%',
          }}
        >
          {children}
        </Box>
      </Box>

      <Box
        sx={{
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...(isMenuOpen && !isMobile && {
            width: `calc(100% - ${280}px)`,
            marginLeft: `${280}px`,
            transition: theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.easeOut,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }),
        }}
      >
        <Footer />
      </Box>
    </Box>
  )
} 