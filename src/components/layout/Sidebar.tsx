import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  useTheme,
  useMediaQuery,
  Divider,
  IconButton,
} from '@mui/material'
import {
  Business as BusinessIcon,
  Dashboard as DashboardIcon,
  Menu as MenuIcon,
} from '@mui/icons-material'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

interface SidebarProps {
  open: boolean
  onClose: () => void
}

const DRAWER_WIDTH = 280

const menuItems = [
  {
    text: 'Minha Empresa',
    icon: <BusinessIcon />,
    path: '/my-company',
    description: 'Gerencie os dados da sua empresa',
  },
  {
    text: 'Dashboard',
    icon: <DashboardIcon />,
    path: '/home',
    description: 'Visão geral do seu negócio',
  },
]

export default function Sidebar({ open, onClose }: SidebarProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const pathname = usePathname()

  const drawer = (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            px: 2,
            py: 1,
            borderRadius: 1,
            backgroundColor: 'primary.main',
            color: 'white',
          }}
        >
          <BusinessIcon />
          <Box>
            <Box sx={{ fontWeight: 'bold' }}>SuperMEI</Box>
            <Box sx={{ fontSize: '0.75rem', opacity: 0.8 }}>
              Gestão Inteligente
            </Box>
          </Box>
        </Box>
      </Box>

      <Divider />

      <List sx={{ flex: 1, px: 2 }}>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            component={Link}
            href={item.path}
            sx={{
              borderRadius: 1,
              mb: 0.5,
              backgroundColor: pathname === item.path ? 'primary.light' : 'transparent',
              color: pathname === item.path ? 'primary.main' : 'text.primary',
              textDecoration: 'none',
              '&:hover': {
                backgroundColor: 'primary.light',
                color: 'primary.main',
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: 'inherit',
                minWidth: 40,
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              secondary={item.description}
              primaryTypographyProps={{
                fontWeight: pathname === item.path ? 'bold' : 'normal',
              }}
              secondaryTypographyProps={{
                fontSize: '0.75rem',
              }}
            />
          </ListItem>
        ))}
      </List>

      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', display: 'flex', justifyContent: 'center' }}>
        <IconButton
          onClick={onClose}
          sx={{
            color: 'primary.main',
            '&:hover': {
              backgroundColor: 'primary.light',
            },
          }}
        >
          <MenuIcon />
        </IconButton>
      </Box>
    </Box>
  )

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'persistent'}
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          width: DRAWER_WIDTH,
          borderRight: '1px solid',
          borderColor: 'divider',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
        },
      }}
    >
      {drawer}
    </Drawer>
  )
} 