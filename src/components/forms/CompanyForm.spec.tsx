import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CompanyForm } from './CompanyForm'
import { validations } from '@/utils/validations'
import { Company } from '@/types/company'

// Mock fetch for CNPJ and CEP API calls
global.fetch = jest.fn()

describe('CompanyForm', () => {
  const mockOnSubmit = jest.fn()
  const defaultProps = {
    onSubmit: mockOnSubmit,
    submitButtonText: 'Submit',
    title: 'Company Form',
    userId: 'user123'
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('CNPJ Validation and Data Fetching', () => {
    it('should fetch company data when valid CNPJ is entered', async () => {
      // Arrange
      const mockCompanyData = {
        nome: 'Test Company',
        fantasia: 'Test Trading Name',
        cep: '12345-678',
        logradouro: 'Test Street',
        numero: '123',
        complemento: 'Test Complement',
        bairro: 'Test Neighborhood',
        localidade: 'Test City',
        uf: 'SP',
        tipo: 'MEI'
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        json: () => Promise.resolve(mockCompanyData)
      })

      // Act
      render(<CompanyForm {...defaultProps} />)
      const cnpjInput = screen.getByLabelText(/cnpj/i)
      fireEvent.change(cnpjInput, { target: { value: '12345678901234' } })

      // Assert
      await waitFor(() => {
        expect(screen.getByDisplayValue('Test Company')).toBeInTheDocument()
        expect(screen.getByDisplayValue('Test Trading Name')).toBeInTheDocument()
        expect(screen.getByDisplayValue('12345-678')).toBeInTheDocument()
      })
    })

    it('should show error and unlock CEP field when CNPJ is invalid', async () => {
      // Arrange
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        json: () => Promise.resolve({ status: 'ERROR' })
      })

      // Act
      render(<CompanyForm {...defaultProps} />)
      const cnpjInput = screen.getByLabelText(/cnpj/i)
      fireEvent.change(cnpjInput, { target: { value: '12345678901234' } })

      // Assert
      await waitFor(() => {
        expect(screen.getByText(/CNPJ não encontrado ou inválido/i)).toBeInTheDocument()
        const cepInput = screen.getByLabelText(/cep/i)
        expect(cepInput).not.toBeDisabled()
      })
    })
  })

  describe('CEP Validation and Address Fields', () => {
    it('should fetch and fill address when valid CEP is entered', async () => {
      // Arrange
      const mockAddressData = {
        cep: '12345-678',
        logradouro: 'Test Street',
        bairro: 'Test Neighborhood',
        localidade: 'Test City',
        uf: 'SP'
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        json: () => Promise.resolve(mockAddressData)
      })

      // Act
      render(<CompanyForm {...defaultProps} />)
      const cepInput = screen.getByLabelText(/cep/i)
      fireEvent.change(cepInput, { target: { value: '12345678' } })

      // Assert
      await waitFor(() => {
        expect(screen.getByDisplayValue('Test Street')).toBeInTheDocument()
        expect(screen.getByDisplayValue('Test Neighborhood')).toBeInTheDocument()
        expect(screen.getByDisplayValue('Test City')).toBeInTheDocument()
        expect(screen.getByDisplayValue('SP')).toBeInTheDocument()
      })
    })

    it('should unlock number and complement fields when address is fetched', async () => {
      // Arrange
      const mockAddressData = {
        cep: '12345-678',
        logradouro: 'Test Street',
        bairro: 'Test Neighborhood',
        localidade: 'Test City',
        uf: 'SP'
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        json: () => Promise.resolve(mockAddressData)
      })

      // Act
      render(<CompanyForm {...defaultProps} />)
      const cepInput = screen.getByLabelText(/cep/i)
      fireEvent.change(cepInput, { target: { value: '12345678' } })

      // Assert
      await waitFor(() => {
        const numberInput = screen.getByLabelText(/número/i)
        const complementInput = screen.getByLabelText(/complemento/i)
        expect(numberInput).not.toBeDisabled()
        expect(complementInput).not.toBeDisabled()
      })
    })
  })

  describe('Form Validation', () => {
    it('should validate required fields on submit', async () => {
      // Act
      render(<CompanyForm {...defaultProps} />)
      const submitButton = screen.getByText('Submit')
      fireEvent.click(submitButton)

      // Assert
      expect(screen.getByText(/razão social é obrigatória/i)).toBeInTheDocument()
      expect(screen.getByText(/cnpj é obrigatório/i)).toBeInTheDocument()
      expect(screen.getByText(/cep é obrigatório/i)).toBeInTheDocument()
    })

    it('should validate email format', () => {
      // Act
      render(<CompanyForm {...defaultProps} />)
      const emailInput = screen.getByLabelText(/email/i)
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } })

      // Assert
      expect(screen.getByText(/email inválido/i)).toBeInTheDocument()
    })

    it('should validate phone format', () => {
      // Act
      render(<CompanyForm {...defaultProps} />)
      const phoneInput = screen.getByLabelText(/telefone/i)
      fireEvent.change(phoneInput, { target: { value: '123' } })

      // Assert
      expect(screen.getByText(/telefone inválido/i)).toBeInTheDocument()
    })

    it('should validate website format', () => {
      // Act
      render(<CompanyForm {...defaultProps} />)
      const websiteInput = screen.getByLabelText(/site/i)
      
      // Test invalid format
      fireEvent.change(websiteInput, { target: { value: 'invalid-website' } })
      expect(screen.getByText(/url inválida/i)).toBeInTheDocument()
      
      // Test valid format
      fireEvent.change(websiteInput, { target: { value: 'https://valid-website.com' } })
      expect(screen.queryByText(/url inválida/i)).not.toBeInTheDocument()
    })

    it('should validate name length', () => {
      // Act
      render(<CompanyForm {...defaultProps} />)
      const nameInput = screen.getByLabelText(/razão social/i)
      
      // Test too short
      fireEvent.change(nameInput, { target: { value: 'Test' } })
      expect(screen.getByText(/razão social deve ter pelo menos 5 caracteres/i)).toBeInTheDocument()
      
      // Test valid length
      fireEvent.change(nameInput, { target: { value: 'Valid Company Name' } })
      expect(screen.queryByText(/razão social deve ter pelo menos 5 caracteres/i)).not.toBeInTheDocument()
    })
  })

  describe('State Registration', () => {
    it('should clear state registration number when exempt is checked', () => {
      // Act
      render(<CompanyForm {...defaultProps} />)
      const exemptCheckbox = screen.getByLabelText(/isento/i)
      const stateRegInput = screen.getByLabelText(/inscrição estadual/i)
      
      fireEvent.change(stateRegInput, { target: { value: '123456789' } })
      fireEvent.click(exemptCheckbox)

      // Assert
      expect(stateRegInput).toHaveValue('')
    })
  })

  describe('Initial Data and Form Submission', () => {
    const mockInitialData: Company = {
      id: 'test-id',
      userId: 'user123',
      cnpj: '12.345.678/9012-34',
      name: 'Initial Company',
      tradingName: 'Initial Trading',
      stateRegistration: {
        number: '123456789',
        isExempt: false,
      },
      municipalRegistration: '987654321',
      address: {
        cep: '12345-678',
        street: 'Initial Street',
        number: '100',
        complement: 'Initial Complement',
        neighborhood: 'Initial Neighborhood',
        city: 'Initial City',
        state: 'SP',
      },
      contact: {
        email: 'initial@test.com',
        phone: '(11) 99999-9999',
        whatsapp: '(11) 88888-8888',
        website: 'https://initial-website.com',
      },
      size: 'MEI' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    it('should render form with initial data', () => {
      // Act
      render(<CompanyForm {...defaultProps} initialData={mockInitialData} />)
      
      // Assert
      expect(screen.getByDisplayValue('Initial Company')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Initial Trading')).toBeInTheDocument()
      expect(screen.getByDisplayValue('12.345.678/9012-34')).toBeInTheDocument()
      expect(screen.getByDisplayValue('123456789')).toBeInTheDocument()
      expect(screen.getByDisplayValue('987654321')).toBeInTheDocument()
      expect(screen.getByDisplayValue('12345-678')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Initial Street')).toBeInTheDocument()
    })
  })

  describe('Address Field Management', () => {
    it('should handle incomplete CEP data correctly', async () => {
      // Arrange
      const mockIncompleteAddressData = {
        cep: '12345-678',
        logradouro: '',
        bairro: '',
        localidade: 'Test City',
        uf: 'SP'
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        json: () => Promise.resolve(mockIncompleteAddressData)
      })

      // Act
      render(<CompanyForm {...defaultProps} />)
      const cepInput = screen.getByLabelText(/cep/i)
      fireEvent.change(cepInput, { target: { value: '12345678' } })

      // Assert
      await waitFor(() => {
        // All address fields should be editable due to incomplete data
        const streetInput = screen.getByLabelText(/rua/i)
        const neighborhoodInput = screen.getByLabelText(/bairro/i)
        const cityInput = screen.getByLabelText(/cidade/i)
        const stateInput = screen.getByLabelText(/estado/i)

        expect(streetInput).not.toBeDisabled()
        expect(neighborhoodInput).not.toBeDisabled()
        expect(cityInput).not.toBeDisabled()
        expect(stateInput).not.toBeDisabled()
      })
    })

    it('should handle CEP API error correctly', async () => {
      // Arrange
      ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('CEP API Error'))

      // Act
      render(<CompanyForm {...defaultProps} />)
      const cepInput = screen.getByLabelText(/cep/i)
      fireEvent.change(cepInput, { target: { value: '12345678' } })

      // Assert
      await waitFor(() => {
        // All address fields should be editable due to API error
        const streetInput = screen.getByLabelText(/rua/i)
        const neighborhoodInput = screen.getByLabelText(/bairro/i)
        const cityInput = screen.getByLabelText(/cidade/i)
        const stateInput = screen.getByLabelText(/estado/i)

        expect(streetInput).not.toBeDisabled()
        expect(neighborhoodInput).not.toBeDisabled()
        expect(cityInput).not.toBeDisabled()
        expect(stateInput).not.toBeDisabled()
      })
    })
  })
}) 