import React from 'react';
import { Box, Slider, Tooltip } from '@mui/material';
import SwapVertRoundedIcon from '@mui/icons-material/SwapVertRounded';
import SwapHorizRoundedIcon from '@mui/icons-material/SwapHorizRounded';

interface ScoreScrollbarProps {
  scrollPosition: number;
  maxScroll: number;
  isVertical: boolean;
  onScrollChange: (val: number) => void;
}

export const ScoreScrollbar: React.FC<ScoreScrollbarProps> = ({ 
  scrollPosition, 
  maxScroll, 
  isVertical, 
  onScrollChange 
}) => {
  const Icon = isVertical ? SwapVertRoundedIcon : SwapHorizRoundedIcon;

  return (
    <Box sx={{
      width: '100%',
      bgcolor: '#F5F5F7',
      borderTop: '1px solid rgba(0,0,0,0.08)',
      
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      
      px: 3, py: 1, gap: 2,
    }}>
      <Tooltip title={isVertical ? "Scroll Vertically" : "Scroll Horizontally"}>
        <Icon sx={{ color: '#9e9e9e', fontSize: 20 }} />
      </Tooltip>
      
      <Slider
        value={scrollPosition} 
        // 关键修复：max 必须 > min，否则报错
        max={maxScroll > 0 ? maxScroll : 1}
        min={0}
        onChange={(_, v) => onScrollChange(v as number)}
        sx={{
          flex: 1, 
          maxWidth: '800px',
          color: '#6750A4', // 紫色滑块
          height: 4,
          padding: '0 !important',
          '& .MuiSlider-thumb': { 
            width: 32, height: 12, borderRadius: 6, bgcolor: '#6750A4', 
            transition: '0.2s',
            '&:hover, &.Mui-focusVisible': { boxShadow: '0px 0px 0px 6px rgba(103, 80, 164, 0.16)' } 
          },
          '& .MuiSlider-rail': { opacity: 0.2, bgcolor: '#000' },
          '& .MuiSlider-track': { border: 'none' }
        }}
      />
    </Box>
  );
};