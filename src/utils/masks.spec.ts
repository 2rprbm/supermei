import { masks } from './masks'

describe('Masks', () => {
  describe('CNPJ Mask', () => {
    it('should format CNPJ correctly when input has only numbers', () => {
      // Arrange
      const input = '12345678901234'

      // Act
      const result = masks.cnpj(input)

      // Assert
      expect(result).toBe('12.345.678/9012-34')
    })

    it('should remove non-numeric characters when formatting CNPJ', () => {
      // Arrange
      const inputs = [
        '12.345.678/9012-34',
        '12a345b678c9012d34',
        '12-345-678-9012-34',
        '12/345/678/9012/34',
      ]

      // Act & Assert
      inputs.forEach(input => {
        expect(masks.cnpj(input)).toBe('12.345.678/9012-34')
      })
    })

    it('should handle incomplete CNPJ input', () => {
      // Arrange
      const inputs = [
        '123', // Should format as much as possible
        '123456', // Should format as much as possible
        '123456789', // Should format as much as possible
      ]

      // Act & Assert
      expect(masks.cnpj(inputs[0])).toBe('12.3')
      expect(masks.cnpj(inputs[1])).toBe('12.345.6')
      expect(masks.cnpj(inputs[2])).toBe('12.345.678/9')
    })

    it('should handle empty input for CNPJ', () => {
      // Arrange
      const input = ''

      // Act
      const result = masks.cnpj(input)

      // Assert
      expect(result).toBe('')
    })
  })

  describe('Phone Mask', () => {
    it('should format phone number correctly when input has only numbers', () => {
      // Arrange
      const input = '12345678901'

      // Act
      const result = masks.phone(input)

      // Assert
      expect(result).toBe('(12) 34567-8901')
    })

    it('should remove non-numeric characters when formatting phone', () => {
      // Arrange
      const inputs = [
        '(12) 34567-8901',
        '12a345b678c901',
        '12-345-678-901',
        '12/345/678/901',
      ]

      // Act & Assert
      inputs.forEach(input => {
        expect(masks.phone(input)).toBe('(12) 34567-8901')
      })
    })

    it('should handle incomplete phone input', () => {
      // Arrange
      const inputs = [
        '12', // Should format as much as possible
        '12345', // Should format as much as possible
        '123456789', // Should format as much as possible
      ]

      // Act & Assert
      expect(masks.phone(inputs[0])).toBe('12')
      expect(masks.phone(inputs[1])).toBe('(12) 345')
      expect(masks.phone(inputs[2])).toBe('(12) 34567-89')
    })

    it('should handle empty input for phone', () => {
      // Arrange
      const input = ''

      // Act
      const result = masks.phone(input)

      // Assert
      expect(result).toBe('')
    })
  })

  describe('CEP Mask', () => {
    it('should format CEP correctly when input has only numbers', () => {
      // Arrange
      const input = '12345678'

      // Act
      const result = masks.cep(input)

      // Assert
      expect(result).toBe('12345-678')
    })

    it('should remove non-numeric characters when formatting CEP', () => {
      // Arrange
      const inputs = [
        '12345-678',
        '12345a678',
        '12345.678',
        '12345/678',
      ]

      // Act & Assert
      inputs.forEach(input => {
        expect(masks.cep(input)).toBe('12345-678')
      })
    })

    it('should handle incomplete CEP input', () => {
      // Arrange
      const inputs = [
        '123', // Should format as much as possible
        '12345', // Should format as much as possible
        '123456', // Should format as much as possible
      ]

      // Act & Assert
      expect(masks.cep(inputs[0])).toBe('123')
      expect(masks.cep(inputs[1])).toBe('12345')
      expect(masks.cep(inputs[2])).toBe('12345-6')
    })

    it('should handle empty input for CEP', () => {
      // Arrange
      const input = ''

      // Act
      const result = masks.cep(input)

      // Assert
      expect(result).toBe('')
    })
  })
}) 