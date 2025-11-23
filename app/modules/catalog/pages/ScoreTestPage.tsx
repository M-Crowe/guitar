import React, { useState } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Divider, 
  TextField, 
  Button, 
  Alert 
} from '@mui/material';
import { ScoreViewer } from '@/modules/player/components/ScoreViewer';

// 示例 AlphaTex：C 大调音阶 (注意：去掉了多余的空格，保持紧凑)
const DEFAULT_TEX = `\\title "C Major Scale"
\\tempo 120
.
:4 3.5.1 5.5.1 2.4.1 3.4.1 5.4.1 2.3.1 4.3.1 5.3.1 |`;

export default function ScoreTestPage() {
  const [texInput, setTexInput] = useState(DEFAULT_TEX);
  const [activeTex, setActiveTex] = useState(DEFAULT_TEX);

  const handleUpdateTex = () => {
    setActiveTex(texInput);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography 
  variant="h3" 
  gutterBottom 
  color="primary"
  component="h1"             // 1. 显式指定 HTML 标签，解决 TS 报错
  sx={{ fontWeight: 'bold' }} // 2. 将样式属性放入 sx 中
>
        🎸 ScoreViewer 组件测试
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        此页面用于测试 AlphaTab 集成功能的稳定性。
        <br />
        注意：ScoreViewer 现在自带"白纸"容器样式，无需外部再包裹 Paper 组件。
      </Typography>

      <Divider sx={{ my: 4 }} />

      {/* --- 测试用例 1: 基础 Tex 渲染 --- */}
      <Box mb={8}>
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          🧪 测试 1: 静态 Tex 文本 (Horizontal Mode)
        </Typography>
        <Alert severity="info" sx={{ mb: 3 }}>
          场景：文章插图。期望结果：自带圆角白底容器，内部横向滚动条。
        </Alert>

        {/* 🔴 修改：移除了 Paper 包裹，直接放置 ScoreViewer */}
        <ScoreViewer 
          height="auto"
          layoutMode="horizontal"
          source={{
            type: 'tex',
            // 🔴 修改：移除缩进，防止 AlphaTab 解析报错
            content: `\\title "Blues Lick Example" 
\\tempo 100
. 
:8 5.3.1 8.2.1 5.2.1 7.3.3 5.3.1 7.4.3 5.4.1 7.5.3 | :2 5.5.1 
:8 5.3.1 8.2.1 5.2.1 7.3.3 5.3.1 7.4.3 5.4.1 7.5.3 | :2 5.5.1 
:8 5.3.1 8.2.1 5.2.1 7.3.3 5.3.1 7.4.3 5.4.1 7.5.3 | :2 5.5.1 
:8 5.3.1 8.2.1 5.2.1 7.3.3 5.3.1 7.4.3 5.4.1 7.5.3 | :2 5.5.1`
          }} 
        />
      </Box>

      {/* --- 测试用例 2: 动态响应测试 --- */}
      <Box mb={8}>
        <Typography variant="h5" gutterBottom>
          🧪 测试 2: 动态数据响应
        </Typography>
        <Alert severity="info" sx={{ mb: 3 }}>
          场景：验证 React 状态变化时，播放器是否能平滑更新。
        </Alert>

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField 
            fullWidth 
            multiline 
            rows={3} 
            label="输入 AlphaTex 代码" 
            value={texInput}
            onChange={(e) => setTexInput(e.target.value)}
            // 输入框保持白色背景，方便输入
            sx={{ bgcolor: 'background.paper' }} 
          />
          <Button 
            variant="contained" 
            onClick={handleUpdateTex}
            sx={{ height: 'fit-content', mt: 1 }}
          >
            更新乐谱
          </Button>
        </Box>

        {/* 🔴 修改：移除了 Paper 包裹 */}
        <ScoreViewer 
          layoutMode="page"
          source={{
            type: 'tex',
            content: activeTex
          }} 
        />
      </Box>

      {/* --- 测试用例 3: GP 文件加载 --- */}
      <Box mb={8}>
        <Typography variant="h5" gutterBottom>
          🧪 测试 3: 本地 GP 文件加载 (Page Mode)
        </Typography>
        <Alert severity="success" sx={{ mb: 3 }}>
          场景：加载完整的练习曲。期望结果：双向滚动正常，不出现双重滚动条。
        </Alert>

        {/* 🔴 修改：移除了 Paper 包裹 */}
        <ScoreViewer 
          height={600}
          layoutMode="page"
          source={{
            type: 'file',
            url: '/tabs/blues_rock_tune.gpx' 
          }} 
        />
      </Box>

    </Container>
  );
}