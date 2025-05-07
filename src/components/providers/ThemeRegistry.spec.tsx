import { render } from '@testing-library/react'
import ThemeRegistry from './ThemeRegistry'
import theme from '@/lib/theme/theme'
import { useTheme } from '@mui/material/styles'

describe('ThemeRegistry Component', () => {
  it('should render children correctly', () => {
    // Arrange
    const testMessage = 'Test Child Component'
    const ChildComponent = () => <div>{testMessage}</div>

    // Act
    const { getByText } = render(
      <ThemeRegistry>
        <ChildComponent />
      </ThemeRegistry>
    )

    // Assert
    expect(getByText(testMessage)).toBeInTheDocument()
  })

  it('should provide theme to children', () => {
    // Arrange
    const TestComponent = () => {
      const themeContext = useTheme()
      // Compara apenas as propriedades principais do tema
      const themeMatch = 
        themeContext.palette.primary.main === theme.palette.primary.main &&
        themeContext.palette.secondary.main === theme.palette.secondary.main &&
        themeContext.typography.fontFamily === theme.typography.fontFamily
      
      return <div data-testid="theme-test">{themeMatch ? 'Theme Match' : 'Theme Mismatch'}</div>
    }

    // Act
    const { getByTestId } = render(
      <ThemeRegistry>
        <TestComponent />
      </ThemeRegistry>
    )

    // Assert
    expect(getByTestId('theme-test')).toHaveTextContent('Theme Match')
  })

  it('should maintain theme consistency across renders', () => {
    // Arrange
    const TestComponent = () => {
      const themeContext = useTheme()
      // Compara apenas as propriedades principais do tema
      const themeMatch = 
        themeContext.palette.primary.main === theme.palette.primary.main &&
        themeContext.palette.secondary.main === theme.palette.secondary.main &&
        themeContext.typography.fontFamily === theme.typography.fontFamily
      
      return <div data-testid="theme-consistency">{themeMatch ? 'Consistent' : 'Inconsistent'}</div>
    }

    // Act
    const { getByTestId, rerender } = render(
      <ThemeRegistry>
        <TestComponent />
      </ThemeRegistry>
    )

    // Assert
    expect(getByTestId('theme-consistency')).toHaveTextContent('Consistent')

    // Act - Rerender
    rerender(
      <ThemeRegistry>
        <TestComponent />
      </ThemeRegistry>
    )

    // Assert - Theme should remain consistent
    expect(getByTestId('theme-consistency')).toHaveTextContent('Consistent')
  })
}) 