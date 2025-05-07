'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Alert,
} from '@mui/material'
import { Visibility, VisibilityOff, Business } from '@mui/icons-material'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signInWithEmailAndPassword(auth, formData.username, formData.password)
      router.push('/home')
    } catch (err: any) {
      console.error('Erro ao fazer login:', err)
      if (err.code === 'auth/invalid-credential') {
        setError('E-mail ou senha incorretos')
      } else if (err.code === 'auth/too-many-requests') {
        setError('Muitas tentativas de login. Tente novamente mais tarde.')
      } else {
        setError('Erro ao fazer login. Tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCancel = () => {
    setFormData({
      username: '',
      password: '',
    })
    setError('')
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%)',
          animation: 'pulse 4s ease-in-out infinite',
        },
        '@keyframes pulse': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' },
        },
      }}
    >
      <Container component="main" maxWidth="xs">
        <Paper
          elevation={8}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            borderRadius: 2,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Business sx={{ fontSize: 40, color: 'white' }} />
          </Box>

          <Typography component="h1" variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            SuperMEI
          </Typography>
          <Typography component="h2" variant="h6" color="text.secondary" gutterBottom>
            Faça login para continuar
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, width: '100%' }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="E-mail"
              name="username"
              autoComplete="email"
              autoFocus
              value={formData.username}
              onChange={handleChange}
              inputProps={{
                'aria-label': 'E-mail'
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Senha"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              inputProps={{
                'aria-label': 'Senha'
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
                  },
                }}
              >
                Entrar
              </Button>
              <Button
                type="button"
                fullWidth
                variant="outlined"
                size="large"
                onClick={handleCancel}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                Cancelar
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
} 