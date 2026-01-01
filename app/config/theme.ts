import { createTheme } from '@mui/material/styles';

// 统一管理颜色常量
export const colors = {
  // 背景色
  bgDark: '#141218',
  bgPaper: '#1D1B20',
  bgCard: '#2B2930',
  bgDeep: '#18181B',
  bgElevated: '#2A2A30',
  bgHover: '#3A3A40',
  bgInput: '#2D2D35',
  
  // 主题色
  primary: '#D0BCFF',
  primaryDark: '#381E72',
  secondary: '#CCC2DC',
  secondaryDark: '#332D41',
  accent: '#6750A4',
  accentLight: '#E8DEF8',
  
  // 文字色
  textPrimary: '#E6E1E5',
  textSecondary: '#958DA5',
  textMuted: 'rgba(255,255,255,0.5)',
  textDisabled: 'rgba(255,255,255,0.4)',
  
  // 功能色
  highlight: '#3B2968',
  border: '#444',
  borderLight: '#e0e0e0',
  divider: 'rgba(255,255,255,0.05)',
} as const;

const bluesTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: colors.primary,
      dark: colors.primaryDark,
      contrastText: '#1D1B20',
    },
    secondary: {
      main: colors.secondary,
      dark: colors.secondaryDark,
    },
    background: {
      default: colors.bgDark,
      paper: colors.bgPaper,
    },
    text: {
      primary: colors.textPrimary,
      secondary: colors.textSecondary,
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: colors.bgCard,
        },
      },
    },
  },
});

export default bluesTheme;