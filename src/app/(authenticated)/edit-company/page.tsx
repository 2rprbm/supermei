'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { companyService } from '@/services/companyService'
import { CompanyForm } from '@/components/forms/CompanyForm'
import { CircularProgress, Box } from '@mui/material'
import { Company } from '@/types/company'

export default function EditCompanyPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [company, setCompany] = useState<Company | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const data = await companyService.getCompanyByUserId(user?.uid || '')
        if (data) {
          setCompany(data)
        } else {
          router.push('/register-company')
        }
      } catch (error) {
        console.error('Erro ao carregar empresa:', error)
        router.push('/my-company')
      } finally {
        setLoading(false)
      }
    }

    if (user?.uid) {
      fetchCompany()
    }
  }, [user?.uid, router])

  const handleSubmit = async (data: Omit<Company, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (!company?.id) throw new Error('ID da empresa não encontrado')
      
      await companyService.updateCompany({
        ...data,
        id: company.id,
        userId: user?.uid || '',
        createdAt: company.createdAt,
        updatedAt: new Date().toISOString(),
      })
      router.push('/my-company')
    } catch (error) {
      console.error('Erro ao atualizar empresa:', error)
      throw error
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!company) {
    return null
  }

  return (
    <CompanyForm
      initialData={company}
      onSubmit={handleSubmit}
      submitButtonText="Salvar Alterações"
      title="Editar Empresa"
      userId={user?.uid || ''}
    />
  )
} 