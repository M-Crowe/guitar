import { Box, Container, Typography, Slider, IconButton, Paper, Stack, Fab, Tooltip } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExpandLessIcon from '@mui/icons-material/ExpandLess'; // 上箭头
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; // 下箭头
import { useNavigate } from 'react-router';

import { useMetronomeStore } from '../store/metronome.store';
import { useMetronome } from '../hooks/useMetronome';

export default function MetronomePage() {
  const navigate = useNavigate();
  
  // 1. 获取 noteValue 和 setNoteValue
  const { 
    bpm, isPlaying, beatsPerMeasure, noteValue,
    setBpm, increaseBpm, decreaseBpm, setBeatsPerMeasure, setNoteValue
  } = useMetronomeStore();
  
  const { activeBeat, toggle } = useMetronome();

  // 调节分子 (几拍)
  const handleChangeBeats = (delta: number) => {
    const newVal = beatsPerMeasure + delta;
    if (newVal >= 1 && newVal <= 12) {
      setBeatsPerMeasure(newVal);
    }
  };

  // 调节分母 (音符时值: 2, 4, 8, 16)
  const handleChangeNoteValue = (delta: number) => {
    // 定义允许的音符时值列表
    const allowedValues = [2, 4, 8, 16];
    const currentIndex = allowedValues.indexOf(noteValue);
    
    let newIndex = currentIndex + delta;
    
    // 边界检查
    if (newIndex < 0) newIndex = 0;
    if (newIndex >= allowedValues.length) newIndex = allowedValues.length - 1;
    
    setNoteValue(allowedValues[newIndex]);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 10 }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 4 }}>
        <IconButton onClick={() => navigate('/')} color="inherit">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight="bold">节拍器</Typography>
      </Stack>

      <Paper 
        elevation={4} 
        sx={{ 
          p: 4, 
          borderRadius: 8, 
          bgcolor: '#1E1C24', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          border: '1px solid #333'
        }}
      >
        {/* --- BPM 显示区 --- */}
        <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 2 }}>TEMPO</Typography>
        <Typography variant="h1" fontWeight="bold" color="primary.main" sx={{ my: 1 }}>
          {bpm}
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>BPM</Typography>

        {/* --- 视觉圆点指示器 --- */}
        <Stack direction="row" spacing={1.5} sx={{ mb: 2, height: 24, alignItems: 'center' }}>
          {Array.from({ length: beatsPerMeasure }).map((_, index) => (
            <Box
              key={index}
              sx={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                bgcolor: activeBeat === index 
                  ? (index === 0 ? '#FF4081' : '#D0BCFF') // 强拍红色，弱拍紫色
                  : '#333',
                boxShadow: activeBeat === index ? '0 0 10px currentColor' : 'none',
                transition: 'all 0.1s',
                transform: activeBeat === index ? 'scale(1.3)' : 'scale(1)',
              }}
            />
          ))}
        </Stack>

        {/* --- 拍号调节控制区 (Time Signature) --- */}
        <Stack 
          direction="row" 
          alignItems="center" 
          spacing={2} 
          sx={{ mb: 5, bgcolor: 'rgba(255,255,255,0.05)', px: 3, py: 1, borderRadius: 4 }}
        >
          {/* 左侧：调节分子 (Beats) */}
          <Stack alignItems="center">
            <IconButton onClick={() => handleChangeBeats(1)} size="small" disabled={beatsPerMeasure >= 12}>
              <ExpandLessIcon fontSize="small" />
            </IconButton>
            <Typography variant="h5" fontWeight="bold">{beatsPerMeasure}</Typography>
            <IconButton onClick={() => handleChangeBeats(-1)} size="small" disabled={beatsPerMeasure <= 1}>
              <ExpandMoreIcon fontSize="small" />
            </IconButton>
          </Stack>

          {/* 中间：斜杠 */}
          <Typography variant="h4" color="text.secondary" sx={{ opacity: 0.5, px: 1 }}>/</Typography>

          {/* 右侧：调节分母 (Note Value) */}
          <Stack alignItems="center">
            <IconButton onClick={() => handleChangeNoteValue(1)} size="small" disabled={noteValue >= 16}>
              <ExpandLessIcon fontSize="small" />
            </IconButton>
            <Typography variant="h5" fontWeight="bold">{noteValue}</Typography>
            <IconButton onClick={() => handleChangeNoteValue(-1)} size="small" disabled={noteValue <= 2}>
              <ExpandMoreIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>

        {/* --- BPM 滑块控制区 --- */}
        <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '100%', mb: 4 }}>
          <IconButton onClick={() => decreaseBpm(1)} sx={{ border: '1px solid #444' }}>
            <RemoveIcon />
          </IconButton>
          <Slider
            value={bpm}
            min={30}
            max={250}
            onChange={(_, val) => setBpm(val as number)}
            color="primary"
            sx={{ height: 8 }}
          />
          <IconButton onClick={() => increaseBpm(1)} sx={{ border: '1px solid #444' }}>
            <AddIcon />
          </IconButton>
        </Stack>
        
        {/* 快速调节 BPM 按钮 */}
        <Stack direction="row" spacing={4} sx={{ mb: 2 }}>
            <IconButton onClick={() => decreaseBpm(5)} size="small" color="secondary">-5</IconButton>
            <IconButton onClick={() => increaseBpm(5)} size="small" color="secondary">+5</IconButton>
        </Stack>

        {/* --- 播放大按钮 --- */}
        <Fab
          color="primary"
          aria-label="play"
          onClick={toggle}
          sx={{ 
            width: 80, 
            height: 80, 
            mt: 2,
            bgcolor: isPlaying ? 'error.main' : 'primary.main',
            '&:hover': { bgcolor: isPlaying ? 'error.dark' : 'primary.dark' },
            boxShadow: isPlaying ? '0 0 20px rgba(244, 67, 54, 0.5)' : undefined
          }}
        >
          {isPlaying ? <PauseIcon sx={{ fontSize: 40 }} /> : <PlayArrowIcon sx={{ fontSize: 40 }} />}
        </Fab>
      </Paper>
    </Container>
  );
}