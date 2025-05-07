import { Box, Typography, Paper, Grid } from '@mui/material'

export default function HomePage() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Bem-vindo ao SuperMEI
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Sua plataforma completa de gestão para MEIs
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              height: '100%',
              background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
              color: 'white',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Gestão Simplificada
            </Typography>
            <Typography>
              Controle suas finanças, documentos e obrigações fiscais em um só lugar
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              height: '100%',
              background: 'linear-gradient(45deg, #2e7d32 30%, #66bb6a 90%)',
              color: 'white',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Controle Total
            </Typography>
            <Typography>
              Acompanhe seus resultados e tome decisões baseadas em dados reais
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
} 