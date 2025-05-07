export const validations = {
  cnpj: (value: string) => {
    if (!value) return 'CNPJ é obrigatório'
    const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/
    if (!cnpjRegex.test(value)) return 'CNPJ inválido'
    return ''
  },

  email: (value: string) => {
    if (!value) return ''
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) return 'Email inválido'
    return ''
  },

  phone: (value: string) => {
    if (!value) return ''
    if (value.length < 14 || value.length > 15) return 'Telefone inválido'
    const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/
    if (!phoneRegex.test(value)) return 'Telefone inválido'
    return ''
  },

  required: (value: string, fieldName: string) => {
    if (!value) return `${fieldName} é obrigatório`
    return ''
  },

  cep: (value: string) => {
    if (!value) return 'CEP é obrigatório'
    const cepRegex = /^\d{5}-\d{3}$/
    if (!cepRegex.test(value)) return 'CEP inválido'
    return ''
  },
} 