interface AddressData {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
  ibge: string
  gia: string
  ddd: string
  siafi: string
}

interface CNPJData {
  cnpj: string
  razao_social: string
  nome_fantasia: string
  situacao_cadastral: string
  data_inicio_atividade: string
  endereco: {
    logradouro: string
    numero: string
    complemento: string
    bairro: string
    municipio: string
    uf: string
    cep: string
  }
  telefone: string
  email: string
  natureza_juridica: string
  capital_social: string
  porte: string
}

export class ExternalApisService {
  static async getAddressByZipCode(zipCode: string): Promise<AddressData | null> {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${zipCode}/json/`)
      if (!response.ok) {
        throw new Error('Erro ao buscar endereço')
      }
      const data = await response.json()
      if (data.erro) {
        throw new Error('CEP não encontrado')
      }
      return data
    } catch (error) {
      console.error('Error fetching address:', error)
      return null
    }
  }

  static async validateCNPJ(cnpj: string): Promise<CNPJData | null> {
    try {
      const response = await fetch(`https://receitaws.com.br/v1/cnpj/${cnpj}`)
      if (!response.ok) {
        throw new Error('Erro ao validar CNPJ')
      }
      const data = await response.json()
      if (data.status === 'ERROR') {
        throw new Error(data.message || 'CNPJ inválido')
      }
      return data
    } catch (error) {
      console.error('Error validating CNPJ:', error)
      return null
    }
  }

  static getBrazilianStates() {
    return [
      { value: 'AC', label: 'Acre' },
      { value: 'AL', label: 'Alagoas' },
      { value: 'AP', label: 'Amapá' },
      { value: 'AM', label: 'Amazonas' },
      { value: 'BA', label: 'Bahia' },
      { value: 'CE', label: 'Ceará' },
      { value: 'DF', label: 'Distrito Federal' },
      { value: 'ES', label: 'Espírito Santo' },
      { value: 'GO', label: 'Goiás' },
      { value: 'MA', label: 'Maranhão' },
      { value: 'MT', label: 'Mato Grosso' },
      { value: 'MS', label: 'Mato Grosso do Sul' },
      { value: 'MG', label: 'Minas Gerais' },
      { value: 'PA', label: 'Pará' },
      { value: 'PB', label: 'Paraíba' },
      { value: 'PR', label: 'Paraná' },
      { value: 'PE', label: 'Pernambuco' },
      { value: 'PI', label: 'Piauí' },
      { value: 'RJ', label: 'Rio de Janeiro' },
      { value: 'RN', label: 'Rio Grande do Norte' },
      { value: 'RS', label: 'Rio Grande do Sul' },
      { value: 'RO', label: 'Rondônia' },
      { value: 'RR', label: 'Roraima' },
      { value: 'SC', label: 'Santa Catarina' },
      { value: 'SP', label: 'São Paulo' },
      { value: 'SE', label: 'Sergipe' },
      { value: 'TO', label: 'Tocantins' },
    ]
  }
} 