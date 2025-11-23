import React, { useState } from 'react';
import { Box, IconButton, Typography, Slider, Stack, Tooltip, Menu, MenuItem } from '@mui/material';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import StopRoundedIcon from '@mui/icons-material/StopRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RepeatRoundedIcon from '@mui/icons-material/RepeatRounded';
import SpeedRoundedIcon from '@mui/icons-material/SpeedRounded';

interface ScoreTopBarProps {
  title: string;
  isPlaying: boolean;
  zoomLevel: number;
  isLooping: boolean;
  playbackSpeed: number;
  onPlayPause: () => void;
  onStop: () => void;
  onZoomChange: (val: number) => void;
  onToggleLoop: () => void;
  onSpeedChange: (speed: number) => void;
}

export const ScoreTopBar: React.FC<ScoreTopBarProps> = ({
  title,
  isPlaying,
  zoomLevel,
  isLooping,
  playbackSpeed,
  onPlayPause,
  onStop,
  onZoomChange,
  onToggleLoop,
  onSpeedChange,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openSpeedMenu = Boolean(anchorEl);

  const handleSpeedClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleSpeedClose = (speed?: number) => {
    setAnchorEl(null);
    if (speed) onSpeedChange(speed);
  };

  return (
    <Box
      sx={{
        bgcolor: '#F5F5F7',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        px: 3, py: 1.5, gap: 2, zIndex: 10,
      }}
    >
      {/* 1. 标题 */}
      <Typography variant="h6" noWrap sx={{ fontWeight: 'bold', color: '#9e9e9e', minWidth: '100px', maxWidth: '200px', userSelect: 'none' }}>
        {title || 'Untitled'}
      </Typography>

      {/* 
          🟢 修复 1：中间 Stack
          - 移除了 alignItems="center"
          - 将其移动到了 sx 属性内部
      */}
      <Stack 
        component="div"
        direction="row" 
        spacing={2} 
        sx={{ 
          flex: 1, 
          maxWidth: '300px', 
          mx: 'auto',
          alignItems: 'center' // ✅ 移到这里，TypeScript 就不会报错了
        }}
      >
        <RemoveRoundedIcon sx={{ color: '#C1C1C1', fontSize: 18 }} />
        <Slider
          size="small" value={zoomLevel} min={50} max={150}
          onChange={(_, v) => onZoomChange(v as number)}
          sx={{
            color: '#D0BCFF', height: 6,
            '& .MuiSlider-thumb': { width: 16, height: 16, bgcolor: '#D0BCFF', border: '3px solid #fff', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' },
            '& .MuiSlider-rail': { opacity: 1, bgcolor: '#E0E0E0' },
            '& .MuiSlider-track': { border: 'none' },
          }}
        />
        <AddRoundedIcon sx={{ color: '#C1C1C1', fontSize: 18 }} />
      </Stack>

      {/* 
          🟢 修复 2：右侧 Stack
          - 移除了 alignItems="center"
          - 新增 sx={{ alignItems: 'center' }}
      */}
      <Stack 
        component="div" 
        direction="row" 
        spacing={1} 
        sx={{ alignItems: 'center' }} // ✅ 移到这里
      >
        
        {/* 循环按钮 */}
        <Tooltip title={`Loop: ${isLooping ? 'On' : 'Off'}`}>
          <IconButton 
            onClick={onToggleLoop}
            size="small"
            sx={{ 
              color: isLooping ? '#6750A4' : '#9e9e9e', 
              bgcolor: isLooping ? '#E8DEF8' : 'transparent',
              '&:hover': { bgcolor: '#E8DEF8' }
            }}
          >
            <RepeatRoundedIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        {/* 速度按钮 */}
        <Tooltip title={`Speed: ${playbackSpeed}x`}>
          <IconButton onClick={handleSpeedClick} size="small" sx={{ color: '#9e9e9e', borderRadius: 1 }}>
            <SpeedRoundedIcon fontSize="small" />
            <Typography variant="caption" sx={{ ml: 0.5, fontWeight: 'bold', width: '24px' }}>{playbackSpeed}x</Typography>
          </IconButton>
        </Tooltip>
        
        {/* 速度菜单 */}
        <Menu anchorEl={anchorEl} open={openSpeedMenu} onClose={() => handleSpeedClose()}>
          {[0.5, 0.75, 1.0, 1.25, 1.5].map((rate) => (
            <MenuItem 
              key={rate} 
              selected={rate === playbackSpeed} 
              onClick={() => handleSpeedClose(rate)}
              dense
            >
              {rate}x
            </MenuItem>
          ))}
        </Menu>

        {/* 分割线 */}
        <Box sx={{ width: 1, height: 24, bgcolor: '#e0e0e0', mx: 1 }} />

        {/* 停止 */}
        <IconButton onClick={onStop} size="small" sx={{ color: '#fff', bgcolor: '#E0E0E0', borderRadius: 1, width: 32, height: 32, '&:hover': { bgcolor: '#d1d1d1' } }}>
          <StopRoundedIcon fontSize="small" />
        </IconButton>

        {/* 播放 */}
        <IconButton onClick={onPlayPause} sx={{ width: 48, height: 48, bgcolor: '#D0BCFF', color: '#fff', boxShadow: '0 4px 16px rgba(208, 188, 255, 0.5)', '&:hover': { bgcolor: '#E8DEF8', transform: 'scale(1.05)' }, transition: 'all 0.2s' }}>
          {isPlaying ? <PauseRoundedIcon fontSize="large" /> : <PlayArrowRoundedIcon fontSize="large" />}
        </IconButton>
      </Stack>
    </Box>
  );
};