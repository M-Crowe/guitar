import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Box, CircularProgress, Alert } from '@mui/material';
import * as alphaTab from '@coderline/alphatab';

import { useAlphaTabTheme } from '../hooks/useAlphaTabTheme';
import { ScoreTopBar } from './ScoreTopBar';
import { ScoreScrollbar } from './ScoreScrollbar';

export interface ScoreViewerProps {
  source: { type: 'tex'; content: string } | { type: 'file'; url: string };
  trackIndex?: number;
  height?: string | number;
  layoutMode?: 'page' | 'horizontal'; // 这里的 Props 依然保持字符串方便使用
}

export const ScoreViewer: React.FC<ScoreViewerProps> = ({ 
  source, 
  trackIndex = 0, 
  height = '600px', 
  layoutMode = 'page' 
}) => {
  // --- Refs ---
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const alphaTabRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<alphaTab.AlphaTabApi | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  
  // --- Theme ---
  const { frameSx, scrollerSx, contentSx, loadingColor } = useAlphaTabTheme();

  // --- State ---
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [songTitle, setSongTitle] = useState('Loading...');
  
  // Player
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isLooping, setIsLooping] = useState(false);      
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0); 

  // Scroll
  const [scrollPos, setScrollPos] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const [hasScroll, setHasScroll] = useState(false);

  const isVertical = layoutMode === 'page';

  // --- Helper: Convert String to Enum ---
  const getAlphaTabLayout = (mode: string): alphaTab.LayoutMode => {
    return mode === 'horizontal' 
      ? alphaTab.LayoutMode.Horizontal 
      : alphaTab.LayoutMode.Page;
  };

  // --- Logic: Update Scroll State ---
  const updateScrollState = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    
    const max = isVertical 
      ? el.scrollHeight - el.clientHeight 
      : el.scrollWidth - el.clientWidth;
    
    // 只有 max > 5 像素时才认为有滚动条 (防止微小误差)
    const currentMax = max > 0 ? max : 0;
    
    setMaxScroll(currentMax);
    setHasScroll(currentMax > 5);
    setScrollPos(isVertical ? el.scrollTop : el.scrollLeft);
  }, [isVertical]);

  // --- Effect 1: AlphaTab Initialization ---
  useEffect(() => {
    const element = alphaTabRef.current;
    const scrollElement = scrollContainerRef.current;
    if (!element || !scrollElement) return;

    const settings: any = {
      core: { fontDirectory: '/assets/font/', useWorkers: false },
      player: {
        enablePlayer: true,
        enableUserInteraction: true,
        enableCursor: true,     // 开启 Bar Cursor (框框)
        enableBeatCursor: true, // 开启 Beat Cursor (线)
        soundFont: '/assets/soundfont/sonivox.sf2',
        scrollElement: scrollElement, 
        scrollOffsetY: 0,
        scrollOffsetX: 0
      },
      display: {
        // 修复：使用帮助函数转换类型
        layoutMode: getAlphaTabLayout(layoutMode),
        scale: zoomLevel / 100,
      },
    };

    try {
      // 销毁旧实例
      if (apiRef.current) apiRef.current.destroy();

      const api = new alphaTab.AlphaTabApi(element, settings);
      apiRef.current = api;
  
      api.renderFinished.on(() => {
        setIsLoading(false);
        setTimeout(updateScrollState, 100); // 延时确保布局稳定
      });

      api.scoreLoaded.on((score) => {
        setError(null);
        setSongTitle(score.title || 'Untitled Score');
        if (score.tracks.length > trackIndex) {
          api.renderTracks([score.tracks[trackIndex]]);
        }
      });

      api.playerStateChanged.on((args) => {
        setIsPlaying(args.state === alphaTab.synth.PlayerState.Playing);
      });

      api.error.on((e) => { 
        console.error('AlphaTab Error:', e);
        if (!e.message?.includes('abort')) setIsLoading(false); 
      });

      // 加载乐谱
      setIsLoading(true);
      if (source.type === 'tex') api.tex(source.content);
      else api.load(source.url);

      // 启动 ResizeObserver 自动监控大小变化
      resizeObserverRef.current = new ResizeObserver(() => {
        api.render();
        updateScrollState();
      });
      resizeObserverRef.current.observe(scrollElement);

    } catch (err) {
      console.error(err);
      setError('Init Error');
      setIsLoading(false);
    }
    
    return () => {
      if (resizeObserverRef.current) resizeObserverRef.current.disconnect();
      if (apiRef.current) apiRef.current.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  // --- Effect 2: Dynamic Updates (Props) ---
  useEffect(() => {
    const api = apiRef.current;
    if (!api) return;

    // Load Source
    // (简化处理：如果 source 变了，通常最好重置组件，但这里尝试动态加载)
    // api.load(...) 

    let needRender = false;

    // Zoom
    if (api.settings.display.scale !== zoomLevel / 100) {
        api.settings.display.scale = zoomLevel / 100;
        needRender = true;
    }

    // 修复：Layout Mode 枚举转换
    const targetLayout = getAlphaTabLayout(layoutMode);
    if (api.settings.display.layoutMode !== targetLayout) {
        api.settings.display.layoutMode = targetLayout;
        needRender = true;
    }
    
    // Loop & Speed
    api.isLooping = isLooping;
    api.playbackSpeed = playbackSpeed;

    if (needRender) {
      api.updateSettings();
      api.render();
    }
  }, [zoomLevel, layoutMode, isLooping, playbackSpeed]);

  // Handle Source Changes Explicitly
  useEffect(() => {
    const api = apiRef.current;
    if(!api) return;
    setIsLoading(true);
    if (source.type === 'tex') api.tex(source.content);
    else api.load(source.url);
  }, [source]);


  // --- Handlers ---
  const handleNativeScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const val = isVertical ? e.currentTarget.scrollTop : e.currentTarget.scrollLeft;
    setScrollPos(val);
  };

  const handleSliderScroll = (newValue: number) => {
    if (scrollContainerRef.current) {
      if (isVertical) {
        scrollContainerRef.current.scrollTop = newValue;
      } else {
        scrollContainerRef.current.scrollLeft = newValue;
      }
    }
  };

  // Wheel Logic for Horizontal Mode
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const handleWheel = (e: WheelEvent) => {
      if (!isVertical && hasScroll) {
        if (e.deltaY !== 0) {
          el.scrollLeft += e.deltaY;
          e.preventDefault();
        }
      }
    };
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [hasScroll, isVertical]);

  return (
    <Box sx={{ ...frameSx, height: height }}>
      
      {/* 顶部栏 */}
      <Box sx={{ flex: '0 0 auto', zIndex: 20 }}>
        <ScoreTopBar 
          title={songTitle}
          isPlaying={isPlaying}
          zoomLevel={zoomLevel}
          isLooping={isLooping}
          playbackSpeed={playbackSpeed}
          onPlayPause={() => apiRef.current?.playPause()}
          onStop={() => apiRef.current?.stop()}
          onZoomChange={setZoomLevel}
          onToggleLoop={() => setIsLooping(!isLooping)}
          onSpeedChange={setPlaybackSpeed}
        />
      </Box>

      {/* 中间滚动区 */}
      <Box 
        ref={scrollContainerRef} 
        sx={scrollerSx} 
        onScroll={handleNativeScroll}
      >
        {isLoading && (
          <Box sx={{ 
            position: 'absolute', inset: 0, zIndex: 50, 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            bgcolor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(2px)'
          }}>
            <CircularProgress size={40} sx={{ color: loadingColor }} />
          </Box>
        )}

        {error && <Alert severity="error" sx={{m:2}}>{error}</Alert>}
        
        <Box sx={contentSx}>
          <div ref={alphaTabRef} style={{ width: '100%' }} />
        </Box>
      </Box>

      {/* 底部滚动条：仅当有滚动空间时显示 */}
      {!isLoading && !error && hasScroll && (
        <Box sx={{ flex: '0 0 auto', zIndex: 20 }}>
          <ScoreScrollbar 
            scrollPosition={scrollPos}
            maxScroll={maxScroll}
            isVertical={isVertical}
            onScrollChange={handleSliderScroll}
          />
        </Box>
      )}
    </Box>
  );
};