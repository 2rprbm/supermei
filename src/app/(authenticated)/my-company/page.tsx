'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  Avatar,
} from '@mui/material'
import BusinessIcon from '@mui/icons-material/Business'
import EditIcon from '@mui/icons-material/Edit'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import ContactMailIcon from '@mui/icons-material/ContactMail'
import { companyService } from '@/services/companyService'
import { useAuth } from '@/contexts/AuthContext'
import { Company } from '@/types/company'

function displayValue(value: string | undefined) {
  return value && value.trim() !== '' ? value : '—'
}

export default function MyCompanyPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [company, setCompany] = useState<Company | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCompany = async () => {
      if (!user?.uid) {
        setCompany(null)
        setLoading(false)
        return
      }
      const companyData = await companyService.getCompanyByUserId(user.uid)
      setCompany(companyData)
      setLoading(false)
    }
    loadCompany()
  }, [user])

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    )
  }

  if (!company) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', py: 4, textAlign: 'center' }}>
        <Paper sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <BusinessIcon sx={{ fontSize: 80, color: 'primary.main' }} />
          <Typography variant="h5" component="h1" gutterBottom>
            Bem-vindo ao SuperMEI!
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Parece que você ainda não cadastrou sua empresa. Vamos começar?
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => router.push('/register-company')}
            startIcon={<BusinessIcon />}
          >
            Cadastrar Minha Empresa
          </Button>
        </Paper>
      </Box>
    )
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', py: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 4, boxShadow: 6, background: 'linear-gradient(135deg, #e3f2fd 0%, #fff 100%)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
              <BusinessIcon fontSize="large" />
            </Avatar>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 700, color: 'primary.main' }}>
              Minha Empresa
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            onClick={() => router.push('/edit-company')}
            sx={{ borderRadius: 2, fontWeight: 600 }}
          >
            Editar
          </Button>
        </Box>

        {/* Informações Gerais */}
        <Card sx={{ mb: 4, borderRadius: 3, boxShadow: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <BusinessIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                Informações Gerais
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">CNPJ</Typography>
                <Typography variant="body1">{displayValue(company.cnpj)}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Razão Social</Typography>
                <Typography variant="body1">{displayValue(company.name)}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Nome Fantasia</Typography>
                <Typography variant="body1">{displayValue(company.tradingName)}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Porte</Typography>
                <Typography variant="body1">{displayValue(company.size)}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Inscrição Estadual</Typography>
                <Typography variant="body1">
                  {company.stateRegistration.isExempt ? 'Isento' : displayValue(company.stateRegistration.number)}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Inscrição Municipal</Typography>
                <Typography variant="body1">{displayValue(company.municipalRegistration)}</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Endereço */}
        <Card sx={{ mb: 4, borderRadius: 3, boxShadow: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <LocationOnIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                Endereço
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="text.secondary">CEP</Typography>
                <Typography variant="body1">{displayValue(company.address.cep)}</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="text.secondary">Rua</Typography>
                <Typography variant="body1">{displayValue(company.address.street)}</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="text.secondary">Número</Typography>
                <Typography variant="body1">{displayValue(company.address.number)}</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="text.secondary">Complemento</Typography>
                <Typography variant="body1">{displayValue(company.address.complement)}</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="text.secondary">Bairro</Typography>
                <Typography variant="body1">{displayValue(company.address.neighborhood)}</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="text.secondary">Cidade</Typography>
                <Typography variant="body1">{displayValue(company.address.city)}</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="text.secondary">Estado</Typography>
                <Typography variant="body1">{displayValue(company.address.state)}</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Contato */}
        <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <ContactMailIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                Contato
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                <Typography variant="body1">{displayValue(company.contact.email)}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Site</Typography>
                <Typography variant="body1">{displayValue(company.contact.website)}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Telefone</Typography>
                <Typography variant="body1">{displayValue(company.contact.phone)}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">WhatsApp</Typography>
                <Typography variant="body1">{displayValue(company.contact.whatsapp)}</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Paper>
    </Box>
  )
} 