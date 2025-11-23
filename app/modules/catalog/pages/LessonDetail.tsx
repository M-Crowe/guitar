// app\modules\catalog\pages\LessonDetail.tsx

import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { 
  Container, Typography, Box, IconButton, Fab, Breadcrumbs, 
  Link as MuiLink, Snackbar, Alert, CircularProgress, Stack, Paper, Grid 
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';

// Types
import type { Lesson, ContentBlock } from '@/types'; 
import type { Chord } from '../components/ChordDiagram';

// API
import { lessonService } from '@/api/lesson.service';

// Components
import Fretboard from '../components/Fretboard';
import ChordDiagram from '../components/ChordDiagram';
import { ScoreViewer } from '../../player/components/ScoreViewer';
import TableOfContents, { type TocItem, MobileTocDrawer } from '../components/TableOfContents';

// ✅ 1. 修改这里：扩展本地类型以匹配 service 中的定义
interface ExtendedContentBlock extends Omit<ContentBlock, 'type'> {
  type: 'text' | 'fretboard' | 'chord-group' | 'score'; // 修正了类型名称并新增了 score
  chords?: Chord[];
  alphaTex?: string;
}

export default function LessonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [mobileTocOpen, setMobileTocOpen] = useState(false);

  const { data: lesson, isLoading } = useQuery({
    queryKey: ['lesson', id],
    queryFn: () => lessonService.getLessonById(Number(id)),
    enabled: !!id
  });

  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioError, setAudioError] = useState(false);
  
  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((e) => {
        console.error("Audio play failed:", e);
        setAudioError(true);
      });
    }
    setIsPlayingAudio(!isPlayingAudio);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleEnded = () => setIsPlayingAudio(false);
    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, [lesson]);

  if (isLoading) return <Box sx={{display:'flex', justifyContent:'center', mt: 10}}><CircularProgress /></Box>;
  if (!lesson) return <Typography sx={{p:4, color:'text.secondary'}}>未找到该课程</Typography>;

  const tocItems: TocItem[] = [];
  lesson.content.forEach((block, index) => {
    if (block.title) {
      tocItems.push({ title: block.title, targetId: `section-${index}` });
    }
  });
  if (lesson.etude) {
    tocItems.push({ title: '实战练习', targetId: 'section-etude' });
  }

  return (
    <Box sx={{ pb: 12, minHeight: '100vh', bgcolor: 'background.default' }}>
      
      {lesson.etude?.audioSrc && (
        <audio ref={audioRef} src={lesson.etude.audioSrc} preload="none" />
      )}

      {/* --- Top Navigation Bar --- */}
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        position: 'sticky',
        top: 0,
        zIndex: 20, 
        bgcolor: 'rgba(18, 18, 18, 0.9)', 
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}>
        <IconButton onClick={() => navigate('/')} edge="start" color="inherit">
          <ArrowBackIcon />
        </IconButton>
        
        <Breadcrumbs aria-label="breadcrumb">
          <MuiLink underline="hover" color="inherit" onClick={() => navigate('/')} sx={{cursor:'pointer'}}>
            首页
          </MuiLink>
          <Typography color="text.primary">第 {lesson.id} 课</Typography>
        </Breadcrumbs>

        <Box sx={{ flexGrow: 1 }} />

        <IconButton 
          color="inherit" 
          onClick={() => setMobileTocOpen(true)}
          sx={{ display: { xs: 'flex', md: 'none' } }}
        >
          <FormatListBulletedIcon />
        </IconButton>
      </Box>

      {/* --- Main Content Layout --- */}
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Stack 
          component="div"
          direction="row" 
          spacing={{ md: 6, lg: 8 }} 
          alignItems="flex-start"
        >
          
          {/* Left: Desktop TOC */}
          <TableOfContents items={tocItems} />

          {/* Right: Lesson Content */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            
            {/* Header Info */}
            <Box sx={{ mb: 6 }}>
              <Typography variant="h4" color="primary.main" fontWeight="bold">{lesson.title}</Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>{lesson.subtitle}</Typography>
              <Typography variant="body1" sx={{ mt: 2, lineHeight: 1.8 }}>
                {lesson.description}
              </Typography>
            </Box>

            {/* Content Blocks */}
            {lesson.content.map((rawBlock, index) => {
              const block = rawBlock as ExtendedContentBlock;

              return (
                <Box 
                  key={index} 
                  id={`section-${index}`} 
                  sx={{ mb: 8, scrollMarginTop: '100px' }}
                >
                  {block.title && (
                    <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
                      {block.title}
                    </Typography>
                  )}

                  {/* 1. 文本渲染 */}
                  {block.type === 'text' && (
                    <Typography paragraph sx={{ color: 'text.secondary', whiteSpace: 'pre-line', fontSize: '1.05rem', lineHeight: 1.8 }}>
                      {block.text}
                    </Typography>
                  )}
                  
                  {/* 2. 指板图渲染 */}
                  {block.type === 'fretboard' && block.notes && (
                     <Fretboard notes={block.notes} />
                  )}

                  {/* 
                      ✅ 3. 和弦组渲染 (修复)
                      旧代码是 block.type === 'chord'，但数据是 'chord-group'
                  */}
                  {block.type === 'chord-group' && block.chords && (
                    <Paper elevation={0} sx={{ p: 3, bgcolor: 'action.hover', borderRadius: 4 }}>
                      <Grid 
                        container 
                        component="div"
                        spacing={4} 
                        justifyContent="center"
                      >
                        {block.chords.map((chord, cIdx) => (
                          <Grid item key={cIdx}>
                            <ChordDiagram chord={chord} />
                          </Grid>
                        ))}
                      </Grid>
                    </Paper>
                  )}

                  {/* 
                      ✅ 4. 乐谱渲染 (新增)
                      用于显示 AlphaTex 练习片段
                  */}
                  {block.type === 'score' && block.alphaTex && (
                     <Box sx={{ 
                       width: '100%', 
                       height: 'auto', 
                       minHeight: '280px',
                       borderRadius: 2,
                       overflow: 'hidden',
                       borderColor: 'divider'
                     }}>
                       <ScoreViewer 
                         source={{ type: 'tex', content: block.alphaTex }} // 这种短练习给个固定高度即可
                         layoutMode="horizontal" // 练习条通常横向显示更好
                       />
                     </Box>
                  )}

                </Box>
              );
            })}

            {/* --- Etude Section --- */}
            {lesson.etude && (
              <Box 
                id="section-etude"
                sx={{ mt: 8, pt: 4, borderTop: '1px dashed', borderColor: 'divider', scrollMarginTop: '100px' }}
              >
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h5" color="primary.main" gutterBottom>
                    实战练习: {lesson.etude.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    使用下方乐谱播放器进行跟练。你可以调整速度、循环播放或缩放谱面。
                  </Typography>
                </Box>
                
                <Box sx={{ height: 600, width: '100%' }}>
                  <ScoreViewer 
                    source={{ type: 'file', url: lesson.etude.gpFile }}
                    height="100%"
                    layoutMode="page"
                  />
                </Box>
              </Box>
            )}
          </Box>
        </Stack>
      </Container>

      <MobileTocDrawer 
        items={tocItems} 
        open={mobileTocOpen} 
        onClose={() => setMobileTocOpen(false)} 
      />

      <Fab 
        color="primary" 
        variant="extended" 
        sx={{ 
          position: 'fixed', 
          bottom: 32, 
          right: 32,
          zIndex: 100,
          bgcolor: isPlayingAudio ? 'secondary.main' : 'primary.main',
          color: isPlayingAudio ? 'secondary.contrastText' : 'primary.contrastText',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
        }}
        onClick={toggleAudio}
      >
        {isPlayingAudio ? <PauseIcon sx={{ mr: 1 }} /> : <PlayArrowIcon sx={{ mr: 1 }} />}
        {isPlayingAudio ? "暂停伴奏" : "播放伴奏"}
      </Fab>

      <Snackbar open={audioError} autoHideDuration={6000} onClose={() => setAudioError(false)}>
        <Alert severity="error" sx={{ width: '100%' }}>
          无法播放伴奏音频，请检查文件是否存在。
        </Alert>
      </Snackbar>
    </Box>
  );
}