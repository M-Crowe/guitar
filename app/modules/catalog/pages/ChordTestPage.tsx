import { Box, Container, Typography, Paper, Stack, Breadcrumbs, Link } from '@mui/material';
import ChordDiagram, { type Chord } from '../components/ChordDiagram';
import { useNavigate } from 'react-router';

export default function ChordTestPage() {
  const navigate = useNavigate();

  const chordsData: Chord[] = [
    {
      name: 'E7',
      subtitle: '(I7)',
      frets: [0, 2, 2, 1, 3, 0], // 0 2 2 1 3 0
      fingers: [0, 2, 3, 1, 4, 0]
    },
    {
      name: 'A7',
      subtitle: '(IV7)',
      // 参考图中的 A7 指法:
      // 6弦: x
      // 5弦: 0 (空)
      // 4弦: 2品 (食指横按)
      // 3弦: 2品 (食指横按)
      // 2弦: 2品 (食指横按)
      // 1弦: 3品 (中指)
      frets: [-1, 0, 2, 2, 2, 3], 
      fingers: [0, 0, 1, 1, 1, 2], // 指法对应: x x 1 1 1 2
      
      // ✅ 添加横按数据
      barres: [
        { fret: 2, fromString: 4, toString: 2 } // 第2品，从4弦横按到2弦
      ]
    },
    {
      name: 'B7',
      subtitle: '(V7)',
      frets: [-1, 2, 1, 2, 0, 2], // x 2 1 2 0 2
      fingers: [0, 2, 1, 3, 0, 4]
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', py: 8, bgcolor: 'background.default' }}>
      <Container maxWidth="md">
        <Breadcrumbs sx={{ mb: 4, color: 'text.secondary' }}>
           <Link underline="hover" color="inherit" onClick={() => navigate('/')} sx={{cursor:'pointer'}}>首页</Link>
           <Typography color="text.primary">和弦渲染测试</Typography>
        </Breadcrumbs>

        <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 1 }}>
          Blues Chord Progressions
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 6 }}>
          SVG 贝塞尔曲线横按渲染测试
        </Typography>

        {/* 卡片容器 */}
        <Paper 
          sx={{ 
            p: 6, 
            borderRadius: 4, 
            border: '1px solid rgba(255,255,255,0.1)',
            bgcolor: '#1e1e1e', // 使用纯深色背景，模拟截图效果
            display: 'flex',
            justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
          }}
        >
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={8} 
            justifyContent="center"
            alignItems="center"
          >
            {chordsData.map((chord, index) => (
              <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <ChordDiagram chord={chord} width={140} height={220} />
              </Box>
            ))}
          </Stack>
        </Paper>

        <Box sx={{ mt: 4, fontFamily: 'monospace', fontSize: '0.8rem', color: 'grey.700', textAlign: 'center' }}>
          * A7 Chord now features a barre (arc) rendering.
        </Box>

      </Container>
    </Box>
  );
}