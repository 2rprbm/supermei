'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { companyService } from '@/services/companyService'
import { CompanyForm } from '@/components/forms/CompanyForm'
import { useEffect, useState } from 'react'
import { CircularProgress, Box, Snackbar, Alert } from '@mui/material'

export default function RegisterCompanyPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login')
      } else {
        setIsLoading(false)
      }
    }
  }, [user, authLoading, router])

  const handleSubmit = async (data: any) => {
    if (!user?.uid) {
      throw new Error('Usuário não autenticado')
    }

    try {
      await companyService.createCompany({
        ...data,
        userId: user.uid,
      })
      setShowSuccess(true)
      setTimeout(() => {
        router.push('/my-company')
      }, 2000)
    } catch (error) {
      console.error('Erro ao cadastrar empresa:', error)
      throw error
    }
  }

  if (isLoading || authLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!user) {
    return null
  }

  return (
    <>
      <CompanyForm
        onSubmit={handleSubmit}
        submitButtonText="Cadastrar Empresa"
        title="Cadastrar Empresa"
        userId={user.uid}
      />
      <Snackbar 
        open={showSuccess} 
        autoHideDuration={2000} 
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Empresa cadastrada com sucesso!
        </Alert>
      </Snackbar>
    </>
  )
} 
