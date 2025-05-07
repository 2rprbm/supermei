import { alpha } from '@mui/material/styles'

export const formStyles = {
  container: {
    maxWidth: 800,
    mx: 'auto',
    py: 4,
  },
  paper: {
    p: 4,
    borderRadius: 3,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: 600,
    color: '#1a1a1a',
    mb: 4,
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: 500,
    color: '#2c3e50',
    mb: 2,
    mt: 4,
    borderBottom: '2px solid #e0e0e0',
    pb: 1,
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  textField: {
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      backgroundColor: '#f8f9fa',
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        backgroundColor: '#f0f2f5',
      },
      '&.Mui-focused': {
        backgroundColor: '#ffffff',
        boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)',
      },
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#e0e0e0',
      },
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: '#bdbdbd',
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#1976d2',
        borderWidth: '1px',
      },
    },
    '& .MuiInputLabel-root': {
      color: '#666',
      fontSize: '0.95rem',
      '&.Mui-focused': {
        color: '#1976d2',
      },
    },
    '& .MuiInputBase-input': {
      fontSize: '0.95rem',
      padding: '12px 16px',
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    '& .MuiFormHelperText-root': {
      marginLeft: '4px',
      fontSize: '0.8rem',
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
  },
  smallTextField: {
    maxWidth: '200px',
  },
  checkbox: {
    '& .MuiCheckbox-root': {
      color: '#1976d2',
    },
    '& .MuiFormControlLabel-label': {
      fontSize: '0.95rem',
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
  },
  submitButton: {
    borderRadius: '12px',
    textTransform: 'none',
    fontSize: '1rem',
    fontWeight: 500,
    padding: '10px 24px',
    boxShadow: '0 2px 8px rgba(25, 118, 210, 0.25)',
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    '&:hover': {
      boxShadow: '0 4px 12px rgba(25, 118, 210, 0.35)',
    },
  },
  errorMessage: {
    color: '#d32f2f',
    fontSize: '0.8rem',
    marginTop: '4px',
    marginLeft: '4px',
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  disabledField: {
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#f5f5f5',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#e0e0e0',
      },
    },
  },
  gridContainer: {
    '& .MuiGrid-item': {
      paddingTop: '8px',
      paddingBottom: '8px',
    },
  },
} 