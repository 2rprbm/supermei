import { validations } from './validations'

describe('Validations', () => {
  describe('CNPJ Validation', () => {
    it('should return error message when CNPJ is empty', () => {
      // Arrange
      const emptyCnpj = ''

      // Act
      const result = validations.cnpj(emptyCnpj)

      // Assert
      expect(result).toBe('CNPJ é obrigatório')
    })

    it('should return error message when CNPJ format is invalid', () => {
      // Arrange
      const invalidCnpjs = [
        '12345678901234', // No formatting
        '12.345.678/9012-3', // Missing digit
        '12.345.678/9012-345', // Extra digit
        '12.345.678/9012-3a', // Invalid character
      ]

      // Act & Assert
      invalidCnpjs.forEach(cnpj => {
        expect(validations.cnpj(cnpj)).toBe('CNPJ inválido')
      })
    })

    it('should return empty string when CNPJ format is valid', () => {
      // Arrange
      const validCnpj = '12.345.678/9012-34'

      // Act
      const result = validations.cnpj(validCnpj)

      // Assert
      expect(result).toBe('')
    })
  })

  describe('Email Validation', () => {
    it('should return empty string when email is empty', () => {
      // Arrange
      const emptyEmail = ''

      // Act
      const result = validations.email(emptyEmail)

      // Assert
      expect(result).toBe('')
    })

    it('should return error message when email format is invalid', () => {
      // Arrange
      const invalidEmails = [
        'invalid.email', // Missing @
        '@domain.com', // Missing local part
        'user@', // Missing domain
        'user@domain', // Missing TLD
        'user name@domain.com', // Contains space
      ]

      // Act & Assert
      invalidEmails.forEach(email => {
        expect(validations.email(email)).toBe('Email inválido')
      })
    })

    it('should return empty string when email format is valid', () => {
      // Arrange
      const validEmails = [
        'user@domain.com',
        'user.name@domain.com',
        'user+tag@domain.com',
        'user@sub.domain.com',
      ]

      // Act & Assert
      validEmails.forEach(email => {
        expect(validations.email(email)).toBe('')
      })
    })
  })

  describe('Phone Validation', () => {
    it('should return empty string when phone is empty', () => {
      // Arrange
      const emptyPhone = ''

      // Act
      const result = validations.phone(emptyPhone)

      // Assert
      expect(result).toBe('')
    })

    it('should return error message when phone format is invalid', () => {
      // Arrange
      const invalidPhone = '1234567890' // No formatting

      // Act
      const result = validations.phone(invalidPhone)

      // Assert
      expect(result).toBe('Telefone inválido')
    })

    it('should return empty string when phone format is valid', () => {
      // Arrange
      const validPhone = '(12) 12345-6789'

      // Act
      const result = validations.phone(validPhone)

      // Assert
      expect(result).toBe('')
    })
  })

  describe('Required Field Validation', () => {
    it('should return error message when field is empty', () => {
      // Arrange
      const emptyValue = ''
      const fieldName = 'Nome'

      // Act
      const result = validations.required(emptyValue, fieldName)

      // Assert
      expect(result).toBe('Nome é obrigatório')
    })

    it('should return empty string when field has value', () => {
      // Arrange
      const value = 'John Doe'
      const fieldName = 'Nome'

      // Act
      const result = validations.required(value, fieldName)

      // Assert
      expect(result).toBe('')
    })
  })

  describe('CEP Validation', () => {
    it('should return error message when CEP is empty', () => {
      // Arrange
      const emptyCep = ''

      // Act
      const result = validations.cep(emptyCep)

      // Assert
      expect(result).toBe('CEP é obrigatório')
    })

    it('should return error message when CEP format is invalid', () => {
      // Arrange
      const invalidCeps = [
        '12345678', // No formatting
        '12345-67', // Missing digit
        '12345-6789', // Extra digit
        '12345-67a', // Invalid character
        '12345 678', // Wrong separator
        '1234-5678', // Wrong format
        '123456', // Too short
        '123456789', // Too long
      ]

      // Act & Assert
      invalidCeps.forEach(cep => {
        expect(validations.cep(cep)).toBe('CEP inválido')
      })
    })

    it('should return empty string when CEP format is valid', () => {
      // Arrange
      const validCep = '12345-678'

      // Act
      const result = validations.cep(validCep)

      // Assert
      expect(result).toBe('')
    })
  })
}) 