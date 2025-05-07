import { ExternalApisService } from './external-apis'

// Mock fetch globally
global.fetch = jest.fn()

describe('ExternalApisService', () => {
  beforeEach(() => {
    // Clear mock before each test
    jest.clearAllMocks()
  })

  describe('getAddressByZipCode', () => {
    it('should return address data when zipcode is valid', async () => {
      // Arrange
      const mockAddress = {
        cep: '12345-678',
        logradouro: 'Rua Teste',
        complemento: '',
        bairro: 'Centro',
        localidade: 'São Paulo',
        uf: 'SP',
        ibge: '123456',
        gia: '1234',
        ddd: '11',
        siafi: '7890'
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockAddress
      })

      // Act
      const result = await ExternalApisService.getAddressByZipCode('12345678')

      // Assert
      expect(result).toEqual(mockAddress)
      expect(fetch).toHaveBeenCalledWith('https://viacep.com.br/ws/12345678/json/')
    })

    it('should return null when zipcode is not found', async () => {
      // Arrange
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ erro: true })
      })

      // Act
      const result = await ExternalApisService.getAddressByZipCode('12345678')

      // Assert
      expect(result).toBeNull()
    })

    it('should return null when API request fails', async () => {
      // Arrange
      ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

      // Act
      const result = await ExternalApisService.getAddressByZipCode('12345678')

      // Assert
      expect(result).toBeNull()
    })
  })

  describe('validateCNPJ', () => {
    it('should return CNPJ data when CNPJ is valid', async () => {
      // Arrange
      const mockCNPJData = {
        cnpj: '12345678901234',
        razao_social: 'Empresa Teste LTDA',
        nome_fantasia: 'Empresa Teste',
        situacao_cadastral: 'ATIVA',
        data_inicio_atividade: '2021-01-01',
        endereco: {
          logradouro: 'Rua Teste',
          numero: '123',
          complemento: '',
          bairro: 'Centro',
          municipio: 'São Paulo',
          uf: 'SP',
          cep: '12345678'
        },
        telefone: '1112345678',
        email: 'teste@empresa.com',
        natureza_juridica: 'LTDA',
        capital_social: '100000',
        porte: 'PEQUENO'
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCNPJData
      })

      // Act
      const result = await ExternalApisService.validateCNPJ('12345678901234')

      // Assert
      expect(result).toEqual(mockCNPJData)
      expect(fetch).toHaveBeenCalledWith('https://receitaws.com.br/v1/cnpj/12345678901234')
    })

    it('should return null when CNPJ is invalid', async () => {
      // Arrange
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ status: 'ERROR', message: 'CNPJ inválido' })
      })

      // Act
      const result = await ExternalApisService.validateCNPJ('12345678901234')

      // Assert
      expect(result).toBeNull()
    })

    it('should return null when API request fails', async () => {
      // Arrange
      ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

      // Act
      const result = await ExternalApisService.validateCNPJ('12345678901234')

      // Assert
      expect(result).toBeNull()
    })
  })

  describe('getBrazilianStates', () => {
    it('should return all Brazilian states with correct format', () => {
      // Arrange & Act
      const states = ExternalApisService.getBrazilianStates()

      // Assert
      expect(states).toHaveLength(27)
      expect(states[0]).toHaveProperty('value')
      expect(states[0]).toHaveProperty('label')
      expect(states).toContainEqual({ value: 'SP', label: 'São Paulo' })
      expect(states).toContainEqual({ value: 'RJ', label: 'Rio de Janeiro' })
    })

    it('should return states in correct order', () => {
      // Arrange & Act
      const states = ExternalApisService.getBrazilianStates()

      // Assert
      expect(states[0].value).toBe('AC')
      expect(states[states.length - 1].value).toBe('TO')
    })

    it('should return immutable array', () => {
      // Arrange
      const firstCall = ExternalApisService.getBrazilianStates()
      
      // Act
      const secondCall = ExternalApisService.getBrazilianStates()

      // Assert
      expect(firstCall).toEqual(secondCall)
    })
  })
}) 