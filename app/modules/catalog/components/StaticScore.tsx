import { useEffect, useRef } from 'react';
import { Box, useTheme } from '@mui/material';
import * as alphaTab from '@coderline/alphatab';

interface StaticScoreProps {
  alphaTex: string;
  width?: string | number;
}

export default function StaticScore({ alphaTex, width = '100%' }: StaticScoreProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<alphaTab.AlphaTabApi | null>(null);
  const theme = useTheme();

  useEffect(() => {
    if (!containerRef.current) return;

    // ✅ 修复配置
    const settings: any = {
      core: {
        engine: 'html5',
        fontDirectory: 'https://cdn.jsdelivr.net/npm/@coderline/alphatab@latest/dist/font/'
      },
      display: {
        layoutMode: 'page',
        // ❌ 之前错误的写法: 'score-tab'
        // ✅ 正确写法: 使用 Enum 或者 'ScoreTab'
        staveProfile: alphaTab.StaveProfile.ScoreTab, 
        
        // 🎨 颜色配置：强制白/浅色，适配深色背景
        resources: {
          mainGlyphColor: theme.palette.text.primary, // 音符
          secondaryGlyphColor: theme.palette.text.secondary,
          
          staffLineColor: 'rgba(255, 255, 255, 0.3)', // 五线谱线
          barLineColor: theme.palette.text.primary,   // 小节线
          repeatLineColor: theme.palette.text.primary,
          
          scoreTitleColor: theme.palette.primary.main, 
          scoreSubTitleColor: theme.palette.text.secondary,
          
          fretNumberColor: theme.palette.text.primary, // 指板数字
        }
      },
      player: {
        enablePlayer: true,
        soundFont: 'https://cdn.jsdelivr.net/npm/@coderline/alphatab@latest/dist/soundfont/sonivox.sf2',
        scrollMode: 'off' 
      }
    };

    apiRef.current = new alphaTab.AlphaTabApi(containerRef.current, settings);

    if (alphaTex) {
      apiRef.current.tex(alphaTex);
    }

    return () => {
      if (apiRef.current) {
        apiRef.current.destroy();
      }
    };
  }, [theme]); 

  useEffect(() => {
    if (apiRef.current && alphaTex) {
      apiRef.current.tex(alphaTex);
    }
  }, [alphaTex]);

  return (
    <Box 
      ref={containerRef} 
      sx={{ 
        width: width, 
        bgcolor: 'transparent', 
        // 强制覆盖内部白色背景
        '& .at-cursor-bar': { bgcolor: 'rgba(255, 255, 255, 0.1) !important' },
        '& .at-selection': { bgcolor: 'rgba(64, 196, 255, 0.2) !important' },
        // 确保 canvas 也是透明的
        '& canvas': { display: 'block' }
      }} 
    />
  );
}