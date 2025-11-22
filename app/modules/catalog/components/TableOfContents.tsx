import { useEffect, useState } from 'react';
import { Box, Typography, List, ListItemButton, ListItemText, Paper, useTheme, alpha, Drawer, IconButton } from '@mui/material';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import CloseIcon from '@mui/icons-material/Close';

export interface TocItem {
  title: string;
  targetId: string;
}

// --- 桌面端组件 Props ---
interface TableOfContentsProps {
  items: TocItem[];
  onLinkClick?: () => void;
}

// --- 手机端组件 Props ---
interface MobileTocDrawerProps {
  items: TocItem[];
  open: boolean;
  onClose: () => void;
}

// ============================================================================
// 📱 手机端组件: MobileTocDrawer (新增)
// ============================================================================
export function MobileTocDrawer({ items, open, onClose }: MobileTocDrawerProps) {
  const theme = useTheme();
  const [activeId, setActiveId] = useState<string>(items.length > 0 ? items[0].targetId : "");

  // 复用滚动监听逻辑，确保打开菜单时能看到当前在哪一章
  useEffect(() => {
    if (!open) return; // 只有打开时才计算，节省性能

    const calculateActive = () => {
      let current = "";
      for (const item of items) {
        const section = document.getElementById(item.targetId);
        if (section && window.scrollY >= (section.offsetTop - 180)) {
          current = item.targetId;
        }
      }
      if (current) setActiveId(current);
      else if (window.scrollY < 100 && items.length > 0) setActiveId(items[0].targetId);
    };

    calculateActive();
  }, [open, items]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      
      onClose(); // 点击后关闭抽屉
    }
  };

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          bgcolor: 'rgba(30, 30, 35, 0.95)', // 深色磨砂背景
          backdropFilter: 'blur(12px)',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          maxHeight: '70vh' // 最多占屏幕 70%
        }
      }}
    >
      {/* 抽屉顶部标题栏 */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
          <FormatListBulletedIcon fontSize="small" />
          <Typography variant="subtitle1" fontWeight="bold">课程目录</Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      {/* 目录列表 */}
      <List sx={{ pt: 0, pb: 4 }}>
        {items.map((item) => {
          const isActive = activeId === item.targetId;
          return (
            <ListItemButton
              key={item.targetId}
              onClick={() => handleClick(item.targetId)}
              sx={{
                py: 1.5,
                borderLeft: '4px solid transparent',
                borderLeftColor: isActive ? 'primary.main' : 'transparent',
                bgcolor: isActive ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                color: isActive ? 'primary.main' : 'text.secondary'
              }}
            >
              <ListItemText 
                primary={item.title} 
                primaryTypographyProps={{ 
                  fontWeight: isActive ? 600 : 400,
                  fontSize: '0.95rem'
                }} 
              />
            </ListItemButton>
          );
        })}
      </List>
    </Drawer>
  );
}

// ============================================================================
// 💻 桌面端组件: TableOfContents (保持不变)
// ============================================================================
export default function TableOfContents({ items, onLinkClick }: TableOfContentsProps) {
  const theme = useTheme();
  const [activeId, setActiveId] = useState<string>(items.length > 0 ? items[0].targetId : "");

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100; 
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
  
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      setActiveId(id); 
      if (onLinkClick) onLinkClick();
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      let current = "";
      for (const item of items) {
        const section = document.getElementById(item.targetId);
        if (section && window.scrollY >= (section.offsetTop - 180)) {
          current = item.targetId;
        }
      }
      if (current) setActiveId(current);
      else if (window.scrollY < 100 && items.length > 0) setActiveId(items[0].targetId);
    };

    window.addEventListener("scroll", handleScroll);
    setTimeout(handleScroll, 100);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [items]); 

  if (items.length === 0) return null;

  return (
    <Box
      component="nav"
      sx={{
        width: 240,
        flexShrink: 0,
        position: 'sticky',
        top: 100,
        maxHeight: 'calc(100vh - 120px)', 
        overflowY: 'auto',
        display: { xs: 'none', md: 'block' }, // ⚠️ 关键：只在 md (桌面) 以上显示
        '&::-webkit-scrollbar': { display: 'none' },
        scrollbarWidth: 'none', 
      }}
    >
      <Typography 
        variant="subtitle2" 
        fontWeight="bold" 
        color="text.secondary"
        sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, px: 2 }}
      >
        <FormatListBulletedIcon fontSize="small" />
        本课大纲
      </Typography>

      <Paper 
        elevation={0} 
        sx={{ 
          bgcolor: 'transparent', 
          borderLeft: `2px solid ${alpha(theme.palette.divider, 0.1)}`,
          borderRadius: 0
        }}
      >
        <List disablePadding>
          {items.map((item) => {
            const isActive = activeId === item.targetId;
            return (
              <ListItemButton
                key={item.targetId}
                onClick={() => handleClick(item.targetId)}
                sx={{
                  py: 1,
                  px: 2,
                  mb: 0.5,
                  borderRadius: '0 8px 8px 0',
                  borderLeft: '2px solid transparent',
                  borderLeftColor: isActive ? 'primary.main' : 'transparent',
                  bgcolor: isActive ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                  marginLeft: '-2px',
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.text.primary, 0.03),
                    color: 'primary.main'
                  }
                }}
              >
                <ListItemText 
                  primary={item.title}
                  primaryTypographyProps={{
                    variant: 'body2',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? 'primary.main' : 'text.secondary',
                    noWrap: true
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Paper>
    </Box>
  );
}