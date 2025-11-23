import { 
  Container, 
  Typography, 
  Card, 
  CardActionArea, 
  Chip, 
  Box, 
  CircularProgress, 
  IconButton,
  Stack,
  useTheme,
  alpha
} from '@mui/material';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import TimerIcon from '@mui/icons-material/Timer'; 
import ChevronRightIcon from '@mui/icons-material/ChevronRight'; 
import { Link } from 'react-router'; 
import { useQuery } from '@tanstack/react-query';
import { lessonService } from '@/api/lesson.service';

export default function CatalogHome() {
  const theme = useTheme();
  
  const { data: lessons, isLoading, error } = useQuery({
    queryKey: ['lessons'],
    queryFn: lessonService.getAllLessons
  });

  if (isLoading) return <Box sx={{display:'flex', justifyContent:'center', mt: 10}}><CircularProgress color="secondary" /></Box>;
  if (error) return <Typography color="error" sx={{textAlign:'center', mt: 4}}>无法加载课程数据</Typography>;

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 12, px: 2 }}>
      
      {/* --- 顶部 Header --- */}
      <Stack 
        direction="row" 
        justifyContent="space-between" 
        alignItems="center" 
        sx={{ mb: 5 }}
      >
        <Box>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 800, 
              fontSize: { xs: '1.8rem', sm: '2.5rem' },
              letterSpacing: '-0.02em',
              color: 'white'
            }}
          >
            Blues Guitar
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5, color: 'rgba(255,255,255,0.5)' }}>
            数字化练习伴侣 · 全程指引
          </Typography>
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <IconButton 
            component={Link} 
            to="/tools/metronome"
            sx={{ 
              bgcolor: '#2A2A30',
              color: 'rgba(255,255,255,0.8)',
              borderRadius: '18px', // 方圆形
              width: 56,
              height: 56,
              transition: 'all 0.2s',
              '&:hover': { bgcolor: '#3A3A40', transform: 'translateY(-2px)' }
            }}
          >
            <TimerIcon />
          </IconButton>
          <Typography variant="caption" display="block" sx={{ mt: 0.8, color: 'rgba(255,255,255,0.4)' }}>
            节拍器
          </Typography>
        </Box>
      </Stack>

      {/* --- 课程列表 (胶囊风格) --- */}
      <Stack spacing={2.5}>
        {lessons?.map((lesson) => (
          <Card 
            key={lesson.id}
            elevation={0}
            sx={{ 
              // 关键点：胶囊大圆角
              borderRadius: '50px', 
              bgcolor: '#18181B', // 极深背景
              overflow: 'hidden', // 确保左侧色块不溢出
              transition: 'transform 0.2s ease',
              '&:hover': {
                transform: 'scale(1.02)',
                bgcolor: '#202025'
              }
            }}
          >
            <CardActionArea 
              component={Link} 
              to={`/lesson/${lesson.id}`} 
              sx={{ 
                display: 'flex', 
                justifyContent: 'flex-start', 
                alignItems: 'stretch', 
                p: 0,
                minHeight: 110 // 保证卡片有一定高度
              }}
            >
              
              {/* 1. 左侧紫色半圆块 */}
              <Box sx={{ 
                width: { xs: 85, sm: 110 }, // 手机上稍微窄一点
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                // 截图里的深紫色
                bgcolor: '#3B2968', 
                color: '#fff',
                flexShrink: 0 // 防止被挤压
              }}>
                <LibraryMusicIcon sx={{ fontSize: { xs: 28, sm: 32 }, opacity: 0.9 }} />
              </Box>
              
              {/* 2. 中间内容区 */}
              <Box sx={{ 
                flex: 1, 
                py: 2.5, 
                px: { xs: 2, sm: 3 }, // 左右内边距
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center',
                minWidth: 0 // 关键：防止flex子项溢出
              }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 700, 
                    fontSize: { xs: '1rem', sm: '1.15rem' }, 
                    lineHeight: 1.2,
                    color: '#fff',
                    mb: 0.5
                  }}
                >
                  {lesson.title}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'rgba(255,255,255,0.5)', 
                    mb: 1.5, 
                    fontSize: '0.85rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {lesson.subtitle}
                </Typography>

                {/* 标签区：关键修复 flexWrap */}
                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', // ✅ 允许换行，解决截图截断问题
                  gap: 0.8 
                }}>
                  {lesson.tags.map(tag => (
                    <Chip 
                      key={tag} 
                      label={tag} 
                      size="small" 
                      sx={{ 
                        height: 22,
                        fontSize: '0.7rem',
                        fontWeight: 500,
                        bgcolor: '#2D2D35', // 深灰标签背景
                        color: '#A0A0AB',
                        border: 'none',
                        '& .MuiChip-label': { px: 1.2 }
                      }}
                    />
                  ))}
                </Box>
              </Box>

              {/* 3. 右侧箭头区 */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                pr: 3, 
                pl: 1,
                color: 'rgba(255,255,255,0.2)' 
              }}>
                <ChevronRightIcon />
              </Box>

            </CardActionArea>
          </Card>
        ))}
      </Stack>
    </Container>
  );
}