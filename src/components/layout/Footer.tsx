import {
  Box,
  Container,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  Link,
} from '@mui/material'
import {
  LinkedIn as LinkedInIcon,
  Instagram as InstagramIcon,
  Facebook as FacebookIcon,
  YouTube as YouTubeIcon,
} from '@mui/icons-material'

export default function Footer() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const socialLinks = [
    { icon: <LinkedInIcon />, url: 'https://linkedin.com/company/supermei', label: 'LinkedIn' },
    { icon: <InstagramIcon />, url: 'https://instagram.com/supermei', label: 'Instagram' },
    { icon: <FacebookIcon />, url: 'https://facebook.com/supermei', label: 'Facebook' },
    { icon: <YouTubeIcon />, url: 'https://youtube.com/supermei', label: 'YouTube' },
  ]

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            align={isMobile ? 'center' : 'left'}
          >
            © {new Date().getFullYear()} SuperMEI. Todos os direitos reservados.
          </Typography>

          <Box sx={{ display: 'flex', gap: 1 }}>
            {socialLinks.map((social) => (
              <IconButton
                key={social.label}
                component={Link}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visite nosso ${social.label}`}
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'primary.main',
                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                  },
                }}
              >
                {social.icon}
              </IconButton>
            ))}
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            align={isMobile ? 'center' : 'right'}
          >
            Desenvolvido por Editora Finantech
          </Typography>
        </Box>
      </Container>
    </Box>
  )
} 