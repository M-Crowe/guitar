import { useTheme, type SxProps, type Theme } from '@mui/material';

export const useAlphaTabTheme = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // 1. 外框 (Frame)
  const frameSx: SxProps<Theme> = {
    position: 'relative',
    bgcolor: '#FFFFFF', // 纯白背景
    color: '#000000',
    borderRadius: 4,
    border: '1px solid',
    borderColor: isDark ? '#444' : '#e0e0e0',
    boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.5)' : '0 2px 20px rgba(0,0,0,0.04)',
    mb: 4,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  };

  // 2. 滚动视口 (Scroller)
  const scrollerSx: SxProps<Theme> = {
    flex: 1,
    width: '100%',
    position: 'relative',
    overflow: 'auto', // 开启原生滚动用于检测，但隐藏滚动条
    scrollBehavior: 'auto',
    
    // 隐藏浏览器原生滚动条
    '&::-webkit-scrollbar': { display: 'none' },
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
  };

  // 3. 内容容器 (Content)
  const contentSx: SxProps<Theme> = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center', // 垂直居中
    minWidth: '100%',      
    minHeight: '100%',     
    width: 'fit-content',  // 允许内容撑开宽度
    
    padding: 4, 
    boxSizing: 'border-box',

    // ====================================================
    // 🟢 样式修复区：光标与选区
    // ====================================================

    // A. 蓝色竖线光标 (Beat Cursor)
    '& .at-cursor-beat': {
      display: 'block !important',
      opacity: '1 !important',
      background: '#5d5dff !important',
      
      // 尺寸与位置修正
      width: '4px ', 
      transform: 'translateX(-50%)', 
      marginLeft: '1px', 
      borderRadius: '2px',
      
      // 强烈的发光效果
      boxShadow: '0 0 8px rgba(93, 93, 255, 0.9) !important',
      
      // 修复：zIndex 必须是字符串
      
      border: 'none !important',
      pointerEvents: 'none',
    },

    // B. 淡紫色小节背景框 (Bar Cursor)
    '& .at-cursor-bar': {
      background: 'rgba(103, 80, 164, 0.15) !important',
      border: '1px solid rgba(103, 80, 164, 0.4) !important',
      width: 'auto ',
      
      // 修复：zIndex 必须是字符串，低于 beat cursor
      zIndex: '998 !important',
      
      pointerEvents: 'none',
    },

    // C. 选区 (Selection)
    '& .at-selection-group': {
      fill: '#6750A4 !important', 
      fillOpacity: '0.15 !important', 
      stroke: 'none !important',
    },
    
    '& .at-selection': {
      backgroundColor: 'rgba(103, 80, 164, 0.15) ',
      border: '1px solid rgba(103, 80, 164, 0.3) !important',
    },

    // Canvas 层级最低
    '& canvas': { 
      display: 'block',
      zIndex: 1, 
    }
  };

  return {
    frameSx,
    scrollerSx,
    contentSx,
    loadingColor: '#6750A4',
  };
};