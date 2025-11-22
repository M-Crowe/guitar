import { Box, Container, Typography, Breadcrumbs, Link, Paper } from '@mui/material';
import { useNavigate } from 'react-router';
import StaticScore from '../components/StaticScore';

export default function ScoreTestPage() {
  const navigate = useNavigate();

  // ✅ 1. 完全照搬成功案例的 AlphaTex 写法
  // 关键点：
  // 1. 元数据 (\title) 和 音符 (:4 ...) 中间必须有一个点 (.) 独占一行
  // 2. 尽量顶格写，不要有多余的缩进空格，防止解析器误判
  const scaleAlphaTex = `
\\title "My React AlphaTab"
\\subtitle "AlphaTex Demo"
\\tempo 120
.
:4 0.6 3.6 5.6 0.6 3.6 5.6 0.6 |
:4 2.6 5.6 7.6 2.6 5.6 7.6 2.6 |
:4 3.5 5.5 7.5 3.5 5.5 7.5 3.5 |
`;

  return (
    <Box sx={{ minHeight: '100vh', py: 8, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Breadcrumbs sx={{ mb: 4, color: 'text.secondary' }}>
           <Link underline="hover" color="inherit" onClick={() => navigate('/')} sx={{cursor:'pointer'}}>首页</Link>
           <Typography color="text.primary">AlphaTab 渲染测试</Typography>
        </Breadcrumbs>

        <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: 'primary.main' }}>
          动态乐谱渲染测试
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 6 }}>
          使用最简 AlphaTex 语法进行测试。
        </Typography>

        <Paper 
          sx={{ 
            p: 4, 
            borderRadius: 4, 
            bgcolor: 'rgba(255, 255, 255, 0.05)', 
            border: '1px solid rgba(255, 255, 255, 0.1)',
            minHeight: 200,
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
          }}
        >
          {/* 调用组件 */}
          <StaticScore alphaTex={scaleAlphaTex} />
        </Paper>

        <Box sx={{ mt: 6 }}>
           <Typography variant="h6" gutterBottom color="text.secondary">AlphaTex Source Code</Typography>
           <Paper sx={{ p: 3, bgcolor: '#111', borderRadius: 2, overflowX: 'auto' }}>
             <pre style={{ color: '#88ccff', fontFamily: 'monospace', margin: 0, fontSize: '0.9rem' }}>
               {scaleAlphaTex}
             </pre>
           </Paper>
        </Box>

      </Container>
    </Box>
  );
}