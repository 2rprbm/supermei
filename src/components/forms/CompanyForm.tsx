'use client'

import { useState, useEffect } from 'react'
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  FormControlLabel,
  Checkbox,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material'
import { formStyles } from '@/styles/formStyles'
import { states } from '@/constants/locations'
import { Company } from '@/types/company'
import { masks } from '@/utils/masks'
import { validations } from '@/utils/validations'

interface CompanyFormProps {
  initialData?: Company
  onSubmit: (data: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  submitButtonText: string
  title: string
  userId: string
}

export function CompanyForm({ initialData, onSubmit, submitButtonText, title, userId }: CompanyFormProps) {
  const [formData, setFormData] = useState<Omit<Company, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>(initialData || {
    cnpj: '',
    name: '',
    tradingName: '',
    stateRegistration: {
      number: '',
      isExempt: false,
    },
    municipalRegistration: '',
    address: {
      cep: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
    },
    contact: {
      email: '',
      phone: '',
      whatsapp: '',
      website: '',
    },
    size: 'MEI',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [addressLoading, setAddressLoading] = useState(false)
  const [addressLocked, setAddressLocked] = useState(true)
  const [fieldsLocked, setFieldsLocked] = useState(true)
  const [editableAddressFields, setEditableAddressFields] = useState<string[]>([])

  useEffect(() => {
    const cnpjDigits = formData.cnpj.replace(/\D/g, '')
    if (cnpjDigits.length === 14) {
      fetchCnpjData(cnpjDigits)
    }
    // eslint-disable-next-line
  }, [formData.cnpj])

  const fetchCnpjData = async (cnpj: string) => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`https://www.receitaws.com.br/v1/cnpj/${cnpj}`)
      const data = await response.json()
      if (data.status === 'ERROR') {
        setError('CNPJ não encontrado ou inválido. Preencha os dados manualmente.')
        setFieldsLocked(false)
        setAddressLocked(false) // Libera apenas o CEP
        setEditableAddressFields([]) // Mantém todos os outros campos bloqueados
        return
      }
      setFormData(prev => ({
        ...prev,
        name: data.nome || '',
        tradingName: data.fantasia || '',
        address: {
          cep: data.cep || '',
          street: data.logradouro || '',
          number: data.numero || '',
          complement: data.complemento || '',
          neighborhood: data.bairro || '',
          city: data.localidade || '',
          state: data.uf || '',
        },
        size: data.tipo === 'MEI' ? 'MEI' : prev.size,
      }))
      setFieldsLocked(false)
      setAddressLocked(false)
      setEditableAddressFields(['number', 'complement'])
    } catch (err) {
      setError('Erro ao consultar CNPJ. Preencha os dados manualmente.')
      setFieldsLocked(false)
      setAddressLocked(false) // Libera apenas o CEP
      setEditableAddressFields([]) // Mantém todos os outros campos bloqueados
    } finally {
      setLoading(false)
    }
  }

  const validateField = (name: string, value: any) => {
    switch (name) {
      case 'cnpj':
        return validations.cnpj(value)
      case 'name':
        if (!value) return 'Razão Social é obrigatória'
        if (value.length < 5) return 'Razão Social deve ter pelo menos 5 caracteres'
        return ''
      case 'stateRegistration.number':
        if (!formData.stateRegistration.isExempt) {
          if (!value) return 'Inscrição estadual é obrigatória'
          if (!/^\d+$/.test(value)) return 'Inscrição estadual deve conter apenas números'
        }
        return ''
      case 'municipalRegistration':
        return validations.required(value, 'Inscrição municipal')
      case 'address.cep':
        if (!value) return 'CEP é obrigatório'
        if (value.replace(/\D/g, '').length < 8) return 'CEP inválido'
        return ''
      case 'address.street':
        if (!value) return 'Rua é obrigatória'
        return ''
      case 'address.number':
        if (!value) return 'Número é obrigatório'
        return ''
      case 'address.neighborhood':
        if (!value) return 'Bairro é obrigatório'
        return ''
      case 'address.city':
        if (!value) return 'Cidade é obrigatória'
        return ''
      case 'address.state':
        if (!value) return 'Estado é obrigatório'
        return ''
      case 'contact.email':
        return validations.email(value)
      case 'contact.phone':
        return validations.phone(value)
      case 'contact.whatsapp':
        return validations.phone(value)
      case 'contact.website':
        if (value && !/^https?:\/\/.+/.test(value)) return 'URL inválida'
        return ''
      default:
        return ''
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    const fieldPath = name.split('.')
    
    let newValue = value
    if (name === 'cnpj') {
      newValue = masks.cnpj(value)
    } else if (name === 'contact.phone' || name === 'contact.whatsapp') {
      newValue = masks.phone(value)
    } else if (name === 'address.cep') {
      newValue = masks.cep(value)
    } else if (name === 'stateRegistration.number') {
      newValue = value.replace(/\D/g, '')
    }
    
    setFormData(prev => {
      const newData = { ...prev }
      let current: any = newData
      
      for (let i = 0; i < fieldPath.length - 1; i++) {
        current = current[fieldPath[i]]
      }
      
      current[fieldPath[fieldPath.length - 1]] = type === 'checkbox' ? checked : newValue

      // Se o checkbox de isenção for marcado, limpa o número da inscrição estadual
      if (name === 'stateRegistration.isExempt' && checked) {
        newData.stateRegistration.number = ''
      }

      return newData
    })

    // Validação em tempo real
    const error = validateField(name, type === 'checkbox' ? checked : newValue)
    setErrors(prev => {
      const newErrors = { ...prev }
      if (name === 'stateRegistration.isExempt' && checked) {
        // Remove o erro da inscrição estadual quando marcado como isento
        delete newErrors['stateRegistration.number']
      }
      newErrors[name] = error
      return newErrors
    })
  }

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, '')
    
    // Limpa todos os campos de endereço quando o CEP muda
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        cep: masks.cep(cep),
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: ''
      }
    }))

    // Validação em tempo real do CEP
    const error = validateField('address.cep', masks.cep(cep))
    setErrors(prev => ({
      ...prev,
      'address.cep': error
    }))

    if (cep.length === 8) {
      setAddressLoading(true)
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
        const data = await response.json()
        
        if (!data.erro) {
          // Verifica se retornou dados completos
          const hasCompleteData = data.logradouro && data.bairro && data.localidade && data.uf
          
          setFormData(prev => ({
            ...prev,
            address: {
              ...prev.address,
              street: data.logradouro || '',
              neighborhood: data.bairro || '',
              city: data.localidade || '',
              state: data.uf || '',
            }
          }))

          if (hasCompleteData) {
            // Se tem dados completos, libera apenas número e complemento
            setEditableAddressFields(['number', 'complement'])
          } else {
            // Se não tem dados completos, libera todos os campos
            setEditableAddressFields(['street', 'number', 'complement', 'neighborhood', 'city', 'state'])
          }
        } else {
          // Se o CEP não for encontrado, libera todos os campos
          setEditableAddressFields(['street', 'number', 'complement', 'neighborhood', 'city', 'state'])
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error)
        // Em caso de erro, libera todos os campos
        setEditableAddressFields(['street', 'number', 'complement', 'neighborhood', 'city', 'state'])
      } finally {
        setAddressLoading(false)
      }
    } else {
      // Se o CEP não estiver completo, bloqueia todos os campos
      setEditableAddressFields([])
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    // Validação do CNPJ
    const cnpjError = validateField('cnpj', formData.cnpj)
    if (cnpjError) newErrors.cnpj = cnpjError

    // Validação da Razão Social
    const nameError = validateField('name', formData.name)
    if (nameError) newErrors.name = nameError

    // Validação da Inscrição Estadual
    const stateRegError = validateField('stateRegistration.number', formData.stateRegistration.number)
    if (stateRegError) newErrors['stateRegistration.number'] = stateRegError

    // Validação do CEP
    const cepError = validateField('address.cep', formData.address.cep)
    if (cepError) newErrors['address.cep'] = cepError

    // Validação da Rua
    const streetError = validateField('address.street', formData.address.street)
    if (streetError) newErrors['address.street'] = streetError

    // Validação do Número
    const numberError = validateField('address.number', formData.address.number)
    if (numberError) newErrors['address.number'] = numberError

    // Validação do Bairro
    const neighborhoodError = validateField('address.neighborhood', formData.address.neighborhood)
    if (neighborhoodError) newErrors['address.neighborhood'] = neighborhoodError

    // Validação da Cidade
    const cityError = validateField('address.city', formData.address.city)
    if (cityError) newErrors['address.city'] = cityError

    // Validação do Estado
    const stateError = validateField('address.state', formData.address.state)
    if (stateError) newErrors['address.state'] = stateError

    // Validação do Email (se preenchido)
    if (formData.contact.email) {
      const emailError = validateField('contact.email', formData.contact.email)
      if (emailError) newErrors['contact.email'] = emailError
    }

    // Validação do Telefone (se preenchido)
    if (formData.contact.phone) {
      const phoneError = validateField('contact.phone', formData.contact.phone)
      if (phoneError) newErrors['contact.phone'] = phoneError
    }

    // Validação do WhatsApp (se preenchido)
    if (formData.contact.whatsapp) {
      const whatsappError = validateField('contact.whatsapp', formData.contact.whatsapp)
      if (whatsappError) newErrors['contact.whatsapp'] = whatsappError
    }

    // Validação do Site (se preenchido)
    if (formData.contact.website) {
      const websiteError = validateField('contact.website', formData.contact.website)
      if (websiteError) newErrors['contact.website'] = websiteError
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Valida o formulário antes de enviar
    if (!validateForm()) {
      setError('Por favor, corrija os erros indicados no formulário.')
      setLoading(false)
      return
    }

    try {
      await onSubmit({ ...formData, userId })
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('Ocorreu um erro ao processar o formulário. Por favor, tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container sx={formStyles.container}>
      <Paper sx={formStyles.paper}>
        <Typography 
          variant="h4" 
          sx={{
            ...formStyles.title,
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            fontSize: '1.75rem',
            color: '#2c3e50',
            textAlign: 'center',
            mb: 4,
            letterSpacing: '-0.5px'
          }}
        >
          Cadastrar SUPERMEI
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} sx={formStyles.gridContainer}>
            <Grid item xs={12}>
              <Typography 
                variant="h6" 
                sx={{
                  ...formStyles.sectionTitle,
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  color: '#2c3e50',
                  mb: 2,
                  letterSpacing: '-0.3px'
                }}
              >
                Dados Básicos
              </Typography>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="CNPJ *"
                name="cnpj"
                value={formData.cnpj}
                onChange={handleChange}
                error={!!errors.cnpj}
                helperText={errors.cnpj}
                sx={{
                  ...formStyles.textField,
                  '& .MuiInputBase-input': {
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.95rem',
                    letterSpacing: '0.5px',
                  },
                  '& .MuiInputLabel-root': {
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.9rem',
                  },
                  '& .MuiFormHelperText-root': {
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.8rem',
                  }
                }}
                placeholder="00.000.000/0000-00"
                InputProps={{
                  style: { textAlign: 'left' },
                  sx: { 
                    '& input': { 
                      textAlign: 'left',
                      '&::placeholder': {
                        textAlign: 'left',
                        opacity: 1
                      }
                    }
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                label="Razão Social *"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                sx={{
                  ...formStyles.textField,
                  '& .MuiInputBase-input': {
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.95rem',
                    letterSpacing: '0.5px',
                  },
                  '& .MuiInputLabel-root': {
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.9rem',
                  },
                  '& .MuiFormHelperText-root': {
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.8rem',
                  }
                }}
                InputProps={{
                  style: { textAlign: 'left' },
                  sx: { 
                    '& input': { 
                      textAlign: 'left',
                      '&::placeholder': {
                        textAlign: 'left',
                        opacity: 1
                      }
                    }
                  },
                  readOnly: fieldsLocked,
                }}
                disabled={fieldsLocked}
              />
            </Grid>

            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                label="Nome Fantasia"
                name="tradingName"
                value={formData.tradingName}
                onChange={handleChange}
                sx={{
                  ...formStyles.textField,
                  '& .MuiInputBase-input': {
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.95rem',
                    letterSpacing: '0.5px',
                  },
                  '& .MuiInputLabel-root': {
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.9rem',
                  }
                }}
                InputProps={{
                  style: { textAlign: 'left' },
                  sx: { 
                    '& input': { 
                      textAlign: 'left',
                      '&::placeholder': {
                        textAlign: 'left',
                        opacity: 1
                      }
                    }
                  },
                  readOnly: fieldsLocked,
                }}
                disabled={fieldsLocked}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Porte da Empresa *"
                name="size"
                value="MEI - Microempreendedor Individual"
                disabled
                sx={{
                  ...formStyles.textField,
                  '& .MuiInputBase-input': {
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.95rem',
                    letterSpacing: '0.5px',
                  },
                  '& .MuiInputLabel-root': {
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.9rem',
                  }
                }}
                InputProps={{
                  style: { textAlign: 'left' },
                  sx: { 
                    '& input': { 
                      textAlign: 'left',
                      '&::placeholder': {
                        textAlign: 'left',
                        opacity: 1
                      }
                    }
                  }
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" sx={formStyles.sectionTitle}>
                Inscrições
              </Typography>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <TextField
                  fullWidth
                  label="Inscrição Estadual *"
                  name="stateRegistration.number"
                  value={formData.stateRegistration.number}
                  onChange={handleChange}
                  error={!!errors['stateRegistration.number']}
                  helperText={errors['stateRegistration.number']}
                  sx={{
                    ...formStyles.textField,
                    '& .MuiInputBase-input': {
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.95rem',
                      letterSpacing: '0.5px',
                    },
                    '& .MuiInputLabel-root': {
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.9rem',
                    },
                    '& .MuiFormHelperText-root': {
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.8rem',
                    }
                  }}
                  placeholder="000000000"
                  disabled={formData.stateRegistration.isExempt}
                  InputProps={{
                    style: { textAlign: 'left' },
                    sx: { 
                      '& input': { 
                        textAlign: 'left',
                        '&::placeholder': {
                          textAlign: 'left',
                          opacity: 1
                        }
                      }
                    }
                  }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.stateRegistration.isExempt}
                      onChange={handleChange}
                      name="stateRegistration.isExempt"
                      sx={{
                        ...formStyles.checkbox,
                        '& .MuiSvgIcon-root': {
                          fontSize: 20,
                        }
                      }}
                    />
                  }
                  label="Isento"
                  sx={{
                    '& .MuiFormControlLabel-label': {
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.9rem',
                    }
                  }}
                />
              </Box>
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Inscrição Municipal"
                name="municipalRegistration"
                value={formData.municipalRegistration}
                onChange={handleChange}
                error={!!errors.municipalRegistration}
                helperText={errors.municipalRegistration}
                sx={{
                  ...formStyles.textField,
                  '& .MuiInputBase-input': {
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.95rem',
                    letterSpacing: '0.5px',
                  },
                  '& .MuiInputLabel-root': {
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.9rem',
                  },
                  '& .MuiFormHelperText-root': {
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.8rem',
                  }
                }}
                placeholder="Digite a inscrição municipal"
                InputProps={{
                  style: { textAlign: 'left' },
                  sx: { 
                    '& input': { 
                      textAlign: 'left',
                      '&::placeholder': {
                        textAlign: 'left',
                        opacity: 1
                      }
                    }
                  }
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography 
                variant="h6" 
                sx={{
                  ...formStyles.sectionTitle,
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  color: '#2c3e50',
                  mb: 2,
                  letterSpacing: '-0.3px'
                }}
              >
                Endereço
              </Typography>
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="CEP *"
                name="address.cep"
                value={formData.address.cep}
                onChange={handleCepChange}
                error={!!errors['address.cep']}
                helperText={errors['address.cep']}
                sx={{
                  ...formStyles.textField,
                  '& .MuiInputBase-input': {
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.95rem',
                    letterSpacing: '0.5px',
                  },
                  '& .MuiInputLabel-root': {
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.9rem',
                  },
                  '& .MuiFormHelperText-root': {
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.8rem',
                  }
                }}
                placeholder="00000-000"
                disabled={addressLocked}
                InputProps={{
                  style: { textAlign: 'left' },
                  sx: { 
                    '& input': { 
                      textAlign: 'left',
                      '&::placeholder': {
                        textAlign: 'left',
                        opacity: 1
                      }
                    }
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Rua *"
                name="address.street"
                value={formData.address.street}
                onChange={handleChange}
                error={!!errors['address.street']}
                helperText={errors['address.street']}
                sx={{
                  ...formStyles.textField,
                  '& .MuiInputBase-input': {
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.95rem',
                    letterSpacing: '0.5px',
                  },
                  '& .MuiInputLabel-root': {
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.9rem',
                  },
                  '& .MuiFormHelperText-root': {
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.8rem',
                  }
                }}
                disabled={!editableAddressFields.includes('street')}
                InputProps={{
                  style: { textAlign: 'left' },
                  sx: { 
                    '& input': { 
                      textAlign: 'left',
                      '&::placeholder': {
                        textAlign: 'left',
                        opacity: 1
                      }
                    }
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Número *"
                name="address.number"
                value={formData.address.number}
                onChange={handleChange}
                error={!!errors['address.number']}
                helperText={errors['address.number']}
                sx={{
                  ...formStyles.textField,
                  '& .MuiInputBase-input': {
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.95rem',
                    letterSpacing: '0.5px',
                  },
                  '& .MuiInputLabel-root': {
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.9rem',
                  },
                  '& .MuiFormHelperText-root': {
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.8rem',
                  }
                }}
                disabled={!editableAddressFields.includes('number')}
                InputProps={{
                  style: { textAlign: 'left' },
                  sx: { 
                    '& input': { 
                      textAlign: 'left',
                      '&::placeholder': {
                        textAlign: 'left',
                        opacity: 1
                      }
                    }
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Complemento"
                name="address.complement"
                value={formData.address.complement}
                onChange={handleChange}
                sx={{
                  ...formStyles.textField,
                  '& .MuiInputBase-input': {
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.95rem',
                    letterSpacing: '0.5px',
                  },
                  '& .MuiInputLabel-root': {
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.9rem',
                  }
                }}
                disabled={!editableAddressFields.includes('complement')}
                InputProps={{
                  style: { textAlign: 'left' },
                  sx: { 
                    '& input': { 
                      textAlign: 'left',
                      '&::placeholder': {
                        textAlign: 'left',
                        opacity: 1
                      }
                    }
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Bairro *"
                name="address.neighborhood"
                value={formData.address.neighborhood}
                onChange={handleChange}
                error={!!errors['address.neighborhood']}
                helperText={errors['address.neighborhood']}
                sx={{
                  ...formStyles.textField,
                  '& .MuiInputBase-input': {
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.95rem',
                    letterSpacing: '0.5px',
                  },
                  '& .MuiInputLabel-root': {
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.9rem',
                  },
                  '& .MuiFormHelperText-root': {
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.8rem',
                  }
                }}
                disabled={!editableAddressFields.includes('neighborhood')}
                InputProps={{
                  style: { textAlign: 'left' },
                  sx: { 
                    '& input': { 
                      textAlign: 'left',
                      '&::placeholder': {
                        textAlign: 'left',
                        opacity: 1
                      }
                    }
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                select
                fullWidth
                label="Estado *"
                name="address.state"
                value={formData.address.state}
                onChange={handleChange}
                error={!!errors['address.state']}
                helperText={errors['address.state']}
                sx={{
                  ...formStyles.textField,
                  '& .MuiInputBase-input': {
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.95rem',
                    letterSpacing: '0.5px',
                  },
                  '& .MuiInputLabel-root': {
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.9rem',
                  },
                  '& .MuiFormHelperText-root': {
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.8rem',
                  }
                }}
                disabled={!editableAddressFields.includes('state')}
                InputProps={{
                  style: { textAlign: 'left' },
                  sx: { 
                    '& input': { 
                      textAlign: 'left',
                      '&::placeholder': {
                        textAlign: 'left',
                        opacity: 1
                      }
                    }
                  }
                }}
              >
                {states.map((state) => (
                  <MenuItem key={state.value} value={state.value}>
                    {state.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Cidade *"
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
                error={!!errors['address.city']}
                helperText={errors['address.city']}
                sx={{
                  ...formStyles.textField,
                  '& .MuiInputBase-input': {
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.95rem',
                    letterSpacing: '0.5px',
                  },
                  '& .MuiInputLabel-root': {
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.9rem',
                  },
                  '& .MuiFormHelperText-root': {
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.8rem',
                  }
                }}
                disabled={!editableAddressFields.includes('city')}
                InputProps={{
                  style: { textAlign: 'left' },
                  sx: { 
                    '& input': { 
                      textAlign: 'left',
                      '&::placeholder': {
                        textAlign: 'left',
                        opacity: 1
                      }
                    }
                  }
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography 
                variant="h6" 
                sx={{
                  ...formStyles.sectionTitle,
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  color: '#2c3e50',
                  mb: 2,
                  letterSpacing: '-0.3px'
                }}
              >
                Contato
              </Typography>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Email"
                name="contact.email"
                value={formData.contact.email}
                onChange={handleChange}
                error={!!errors['contact.email']}
                helperText={errors['contact.email']}
                sx={{
                  ...formStyles.textField,
                  '& .MuiInputBase-input': {
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.95rem',
                    letterSpacing: '0.5px',
                  },
                  '& .MuiInputLabel-root': {
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.9rem',
                  },
                  '& .MuiFormHelperText-root': {
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.8rem',
                  }
                }}
                placeholder="seu@email.com"
                InputProps={{
                  style: { textAlign: 'left' },
                  sx: { 
                    '& input': { 
                      textAlign: 'left',
                      '&::placeholder': {
                        textAlign: 'left',
                        opacity: 1
                      }
                    }
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Site"
                name="contact.website"
                value={formData.contact.website}
                onChange={handleChange}
                error={!!errors['contact.website']}
                helperText={errors['contact.website']}
                sx={{
                  ...formStyles.textField,
                  '& .MuiInputBase-input': {
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.95rem',
                    letterSpacing: '0.5px',
                  },
                  '& .MuiInputLabel-root': {
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.9rem',
                  },
                  '& .MuiFormHelperText-root': {
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.8rem',
                  }
                }}
                placeholder="https://www.seusite.com"
                InputProps={{
                  style: { textAlign: 'left' },
                  sx: { 
                    '& input': { 
                      textAlign: 'left',
                      '&::placeholder': {
                        textAlign: 'left',
                        opacity: 1
                      }
                    }
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Telefone"
                name="contact.phone"
                value={formData.contact.phone}
                onChange={handleChange}
                error={!!errors['contact.phone']}
                helperText={errors['contact.phone']}
                sx={{
                  ...formStyles.textField,
                  '& .MuiInputBase-input': {
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.95rem',
                    letterSpacing: '0.5px',
                  },
                  '& .MuiInputLabel-root': {
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.9rem',
                  },
                  '& .MuiFormHelperText-root': {
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.8rem',
                  }
                }}
                placeholder="(00) 00000-0000"
                InputProps={{
                  style: { textAlign: 'left' },
                  sx: { 
                    '& input': { 
                      textAlign: 'left',
                      '&::placeholder': {
                        textAlign: 'left',
                        opacity: 1
                      }
                    }
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="WhatsApp"
                name="contact.whatsapp"
                value={formData.contact.whatsapp}
                onChange={handleChange}
                error={!!errors['contact.whatsapp']}
                helperText={errors['contact.whatsapp']}
                sx={{
                  ...formStyles.textField,
                  '& .MuiInputBase-input': {
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.95rem',
                    letterSpacing: '0.5px',
                  },
                  '& .MuiInputLabel-root': {
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.9rem',
                  },
                  '& .MuiFormHelperText-root': {
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.8rem',
                  }
                }}
                placeholder="(00) 00000-0000"
                InputProps={{
                  style: { textAlign: 'left' },
                  sx: { 
                    '& input': { 
                      textAlign: 'left',
                      '&::placeholder': {
                        textAlign: 'left',
                        opacity: 1
                      }
                    }
                  }
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={formStyles.submitButton}
                >
                  {loading ? <CircularProgress size={24} /> : submitButtonText}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  )
} 